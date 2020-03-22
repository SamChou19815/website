/* eslint-disable no-param-reassign */
import solver, { IModel } from 'javascript-lp-solver';

import { leveledTopologicalSort } from '../../models/redux-store-task';
import { ReduxStoreTask } from '../../models/redux-store-types';

/**
 * Minimize the crossing between tasks graph connection.
 *
 * Adapted from:
 * https://github.com/erikbrinkman/d3-dag/blob/bad7cf0641171d8f0519761c14bc34938472b681/src/sugiyama/decross/opt.js
 *
 * @param tasks tasks to order into layers of ordered task.
 * @returns a list of ordered tasks, each inner list is an ordered list of tasks.
 * Task should appear in this order during rendering.
 */
export default function minimizeCross(
  tasks: readonly ReduxStoreTask[]
): readonly ReduxStoreTask[][] {
  const taskGraph: { readonly [key: string]: ReduxStoreTask } = (() => {
    const mutableTaskMap: { [key: string]: ReduxStoreTask } = {};
    tasks.forEach((task) => {
      mutableTaskMap[task.taskId] = task;
    });
    return mutableTaskMap;
  })();

  type FullModel = Required<Omit<IModel, 'binaries' | 'unrestricted' | 'options'>>;

  const key = (...nodes: readonly ReduxStoreTask[]): string =>
    nodes
      .map((n) => n.taskId)
      .sort()
      .join('\0\0');

  const permutations = (model: FullModel, layer: ReduxStoreTask[]) => {
    layer.sort((n1, n2) => n1.taskId.localeCompare(n2.taskId));

    layer.slice(0, layer.length - 1).forEach((n1, i) =>
      layer.slice(i + 1).forEach((n2) => {
        const pair = key(n1, n2);
        model.ints[pair] = 1;
        model.constraints[pair] = { max: 1 };
        model.variables[pair] = { [pair]: 1 };
      })
    );

    layer.slice(0, layer.length - 1).forEach((n1, i) =>
      layer.slice(i + 1).forEach((n2, j) => {
        const pair1 = key(n1, n2);
        layer.slice(i + j + 2).forEach((n3) => {
          const pair2 = key(n1, n3);
          const pair3 = key(n2, n3);
          const triangle = key(n1, n2, n3);

          const triangleUp = `${triangle}+`;
          model.constraints[triangleUp] = { max: 1 };
          model.variables[pair1][triangleUp] = 1;
          model.variables[pair2][triangleUp] = -1;
          model.variables[pair3][triangleUp] = 1;

          const triangleDown = `${triangle}-`;
          model.constraints[triangleDown] = { min: 0 };
          model.variables[pair1][triangleDown] = 1;
          model.variables[pair2][triangleDown] = -1;
          model.variables[pair3][triangleDown] = 1;
        });
      })
    );
  };

  function cross(model: FullModel, layer: readonly ReduxStoreTask[]) {
    layer.slice(0, layer.length - 1).forEach((p1, i) =>
      layer.slice(i + 1).forEach((p2) => {
        const pairp = key(p1, p2);
        p1.dependencies.forEach((c1Id) => {
          const c1 = taskGraph[c1Id];
          if (c1 == null) {
            return;
          }
          p2.dependencies
            .filter((c) => c !== c1Id)
            .forEach((c2Id) => {
              const c2 = taskGraph[c2Id];
              if (c2 == null) {
                return;
              }
              const pairc = key(c1, c2);
              const slack = `${pairp}\0\0\0${pairc}`;
              const slackUp = `${slack}'\0\0\0+`;
              const slackDown = `${slack}'\0\0\0-`;
              model.variables[slack] = {
                [slackUp]: 1,
                [slackDown]: 1,
                crossings: 1,
              };

              const flip = +(c1.taskId > c2.taskId);
              const sign = flip || -1;

              model.constraints[slackUp] = { min: flip };
              model.variables[pairp][slackUp] = 1;
              model.variables[pairc][slackUp] = sign;

              model.constraints[slackDown] = { min: -flip };
              model.variables[pairp][slackDown] = -1;
              model.variables[pairc][slackDown] = -sign;
            });
        });
      })
    );
  }

  function decrossOpt(layers: readonly ReduxStoreTask[][]) {
    // Initialize model
    const model: FullModel = {
      optimize: 'crossings',
      opType: 'min',
      constraints: {},
      variables: {},
      ints: {},
    };

    // Add variables and permutation invariants
    layers.forEach((layer) => permutations(model, layer));

    // Add crossing minimization
    layers.slice(0, layers.length - 1).forEach((layer) => cross(model, layer));

    // Solve objective
    const ordering = solver.Solve(model);

    // Sort layers
    layers.forEach((layer) =>
      layer.sort((n1, n2) => n1.taskId.localeCompare(n2.taskId) * (ordering[key(n1, n2)] || -1))
    );

    return layers;
  }

  return decrossOpt(leveledTopologicalSort(tasks) as readonly ReduxStoreTask[][]);
}
