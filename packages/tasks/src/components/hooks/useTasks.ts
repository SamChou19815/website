import { useSelector } from 'react-redux';

import { TaskId, ProjectId } from '../../models/ids';
import {
  getTransitiveDependencyTaskIds,
  getTransitiveReverseDependencyTaskIds,
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

export const useNonCycleFormingDependencies = (
  taskId: TaskId | null,
  projectId: ProjectId | undefined,
  dependencies: readonly TaskId[]
): readonly [readonly ReduxStoreTask[], readonly ReduxStoreTask[]] =>
  useSelector(({ tasks }: ReduxStoreState): readonly [
    readonly ReduxStoreTask[],
    readonly ReduxStoreTask[]
  ] => {
    const transitiveDependencySet = new Set<TaskId>();
    dependencies.forEach((dependencyTaskId) => {
      getTransitiveDependencyTaskIds(tasks, dependencyTaskId).forEach((id) =>
        transitiveDependencySet.add(id)
      );
    });

    const comparator = (task1: ReduxStoreTask, task2: ReduxStoreTask) =>
      task1.name.localeCompare(task2.name);
    if (taskId === null) {
      const allEligible = Object.values(tasks)
        .filter((task) => projectId === undefined || task.projectId === projectId)
        .sort(comparator);
      const allEligibleGivenDependencies = allEligible.filter(
        (task) => !transitiveDependencySet.has(task.taskId)
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
      (task) => !transitiveDependencySet.has(task.taskId)
    );
    return [allEligible, allEligibleGivenDependencies];
  });
