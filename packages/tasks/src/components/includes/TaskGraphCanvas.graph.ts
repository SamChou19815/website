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
export const minimizeCross = (tasks: readonly ReduxStoreTask[]): readonly ReduxStoreTask[][] => {
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
      .join(' -> ');

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
              const slack = `${pairp} --> ${pairc}`;
              const slackUp = `${slack} --> +`;
              const slackDown = `${slack} --> -`;
              model.variables[slack] = {
                [slackUp]: 1,
                [slackDown]: 1,
                crossings: 1,
              };

              const flip = c1.taskId.localeCompare(c2.taskId);
              const sign = flip || -1;

              let pairPVariables = model.variables[pairp];
              if (pairPVariables == null) {
                pairPVariables = {};
                model.variables[pairp] = pairPVariables;
              }
              let pairCVariables = model.variables[pairc];
              if (pairCVariables == null) {
                pairCVariables = {};
                model.variables[pairc] = pairCVariables;
              }

              model.constraints[slackUp] = { min: flip };
              pairPVariables[slackUp] = 1;
              pairCVariables[slackUp] = sign;

              model.constraints[slackDown] = { min: -flip };
              pairPVariables[slackDown] = -1;
              pairCVariables[slackDown] = -sign;
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
};

type TaskRectangle = { readonly startX: number; readonly startY: number };
type GraphCardComponent = TaskRectangle & {
  readonly task: ReduxStoreTask;
  readonly width: number;
  readonly height: number;
  readonly color: string;
};
type GraphIconComponent = TaskRectangle & {
  readonly task: ReduxStoreTask;
  readonly completed: boolean;
};
type GraphTextComponent = TaskRectangle & {
  readonly task: ReduxStoreTask;
  readonly text: string;
  readonly maxWidth: number;
};
type GraphArrowComponent = TaskRectangle & {
  readonly id: string;
  readonly endX: number;
  readonly endY: number;
  readonly controlX: number;
  readonly controlY: number;
};
type GraphComponents = {
  readonly cards: readonly GraphCardComponent[];
  readonly icons: readonly GraphIconComponent[];
  readonly texts: readonly GraphTextComponent[];
  readonly arrows: readonly GraphArrowComponent[];
  readonly canvasWidth: number;
  readonly canvasHeight: number;
  readonly textSize: number;
  readonly iconSize: number;
};

const MARGIN = 64;
const PADDING = 16;
const TEXT_SIZE = 20;
const ICON_SIZE = 36;
const WIDTH = 350;
const HEIGHT = 64;
const MAX_UNTRIMMED_TEXT_LENGTH = 27;

const getTaskRectangle = (level: number, index: number): TaskRectangle => ({
  startX: index * (MARGIN + WIDTH) + MARGIN / 2,
  startY: level * (MARGIN + HEIGHT) + MARGIN / 2,
});
const autoTrimText = (text: string): string => {
  if (text.length < MAX_UNTRIMMED_TEXT_LENGTH) {
    return text;
  }
  return `${text.substring(0, MAX_UNTRIMMED_TEXT_LENGTH)}...`;
};

export const generateGraphComponents = (
  taskWithPositionMap: { readonly [taskId: string]: Readonly<{ level: number; index: number }> },
  leveledTasks: readonly (readonly ReduxStoreTask[])[],
  colors: { readonly [projectId: string]: string }
): GraphComponents => {
  const cards: GraphCardComponent[] = [];
  const icons: GraphIconComponent[] = [];
  const texts: GraphTextComponent[] = [];
  const arrows: GraphArrowComponent[] = [];
  const canvasWidth =
    (MARGIN + WIDTH) *
    leveledTasks.reduce((max, tasksInLevel) => Math.max(max, tasksInLevel.length), 0);
  const canvasHeight = (MARGIN + HEIGHT) * leveledTasks.length;

  // Draw Task Cards
  leveledTasks.forEach((tasksInLevel, level) => {
    tasksInLevel.forEach((task, index) => {
      const { startX, startY } = getTaskRectangle(level, index);
      cards.push({
        task,
        startX,
        startY,
        width: WIDTH,
        height: HEIGHT,
        color: colors[task.projectId],
      });

      icons.push({
        task,
        completed: task.completed,
        startX: startX + PADDING / 2,
        startY: startY - ICON_SIZE / 2 + HEIGHT / 2 + 4,
      });

      texts.push({
        task,
        text: autoTrimText(task.name),
        startX: startX + PADDING + ICON_SIZE,
        startY: startY + TEXT_SIZE / 2 + HEIGHT / 2,
        maxWidth: WIDTH - (PADDING * 3) / 2 - ICON_SIZE,
      });
    });
  });

  // Draw Dependency Arrows
  leveledTasks.forEach((tasksInLevel, level) => {
    tasksInLevel.forEach((task, index) => {
      const { startX: endX, startY: endY } = getTaskRectangle(level, index);
      task.dependencies.forEach((dependentTaskId) => {
        const dependentTaskWithPosition = taskWithPositionMap[dependentTaskId];
        if (dependentTaskWithPosition == null) {
          return;
        }
        const { startX, startY } = getTaskRectangle(
          dependentTaskWithPosition.level,
          dependentTaskWithPosition.index
        );
        arrows.push({
          id: `${task.taskId}-${dependentTaskId}`,
          startX: startX + WIDTH / 2,
          startY: startY + HEIGHT,
          endX: endX + WIDTH / 2,
          endY,
          controlX: endX + WIDTH / 2 - ((endX - startX) * 1) / 3,
          controlY: endY,
        });
      });
    });
  });

  return {
    cards,
    icons,
    texts,
    arrows,
    canvasWidth,
    canvasHeight,
    textSize: TEXT_SIZE,
    iconSize: ICON_SIZE,
  };
};
