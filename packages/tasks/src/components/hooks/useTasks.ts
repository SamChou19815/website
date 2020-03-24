import { useSelector } from 'react-redux';

import { TaskId, ProjectId } from '../../models/ids';
import {
  getTransitiveDependencyTaskIds,
  getTransitiveReverseDependencyTaskIds,
  hasInternallyReachableTask,
} from '../../models/redux-store-task';
import { ReduxStoreTask, ReduxStoreState } from '../../models/redux-store-types';

export const useTransitiveDependencies = (taskId: TaskId): readonly ReduxStoreTask[] =>
  useSelector(({ tasks }: ReduxStoreState) =>
    Array.from(getTransitiveDependencyTaskIds(tasks, taskId).values()).map((id) => tasks[id])
  );

export const useTransitiveReverseDependencies = (taskId: TaskId): readonly ReduxStoreTask[] =>
  useSelector(({ tasks }: ReduxStoreState) =>
    Array.from(getTransitiveReverseDependencyTaskIds(tasks, taskId).values()).map((id) => tasks[id])
  );

/**
 * This hook is used to generate a tuple consistents of two task lists.
 * - The first list contains all potential dependencies of the given `taskId` within the same project.
 *   If it is added, it won't form a cycle in the new dependency graph.
 * - The second list is a sublist of the first list. It filters away the tasks that, if added, would
 *   make dependency list contains two task (t1, t2) such that t2 is reachable from t1.
 *   (This restriction tends to make the graph look nicer.)
 *
 * @param taskId the id of the task to compute eligible dependencies.
 * If it is null, then all tasks within the project will automatically be admitted.
 * @param projectId dependencies will be restricted to those within the same project.
 *        If it's `undefined`, then two empty lists will always be returned.
 * @param dependencies a list of already added dependencies.
 * @returns a tuple of listed. See the specification above.
 */
export const useEligibleDependencies = (
  taskId: TaskId | null,
  projectId: ProjectId | undefined,
  dependencies: readonly TaskId[]
): readonly [readonly ReduxStoreTask[], readonly ReduxStoreTask[]] =>
  useSelector(({ tasks }: ReduxStoreState): readonly [
    readonly ReduxStoreTask[],
    readonly ReduxStoreTask[]
  ] => {
    if (projectId === undefined) {
      return [[], []];
    }

    const comparator = (task1: ReduxStoreTask, task2: ReduxStoreTask) =>
      task1.name.localeCompare(task2.name);
    if (taskId === null) {
      const allEligible = Object.values(tasks)
        .filter((task) => task.projectId === projectId)
        .sort(comparator);
      const allEligibleGivenDependencies = allEligible.filter(
        (task) => !hasInternallyReachableTask(tasks, [...dependencies, task.taskId])
      );
      return [allEligible, allEligibleGivenDependencies];
    }
    const reverseDependencySet = getTransitiveReverseDependencyTaskIds(tasks, taskId);
    const allEligible = Object.values(tasks)
      .filter(
        (task) =>
          !reverseDependencySet.has(task.taskId) &&
          task.projectId === projectId &&
          taskId !== task.taskId
      )
      .sort(comparator);
    const allEligibleGivenDependencies = allEligible.filter(
      (task) => !hasInternallyReachableTask(tasks, [...dependencies, task.taskId])
    );
    return [allEligible, allEligibleGivenDependencies];
  });
