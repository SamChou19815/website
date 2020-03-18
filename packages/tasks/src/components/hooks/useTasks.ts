import { useSelector } from 'react-redux';

import { TaskId, ProjectId } from '../../models/ids';
import {
  getTransitiveDependencyTaskIds,
  getTransitiveReverseDependencyTaskIds
} from '../../models/redux-store-task';
import { ReduxStoreTask, ReduxStoreState } from '../../models/redux-store-types';

export const useTransitiveDependencies = (taskId: TaskId): readonly ReduxStoreTask[] =>
  useSelector(({ tasks }: ReduxStoreState) =>
    Array.from(getTransitiveDependencyTaskIds(tasks, taskId).values()).map(id => tasks[id])
  );

export const useTransitiveReverseDependencies = (taskId: TaskId): readonly ReduxStoreTask[] =>
  useSelector(({ tasks }: ReduxStoreState) =>
    Array.from(getTransitiveReverseDependencyTaskIds(tasks, taskId).values()).map(id => tasks[id])
  );

export const useNonCycleFormingDependencies = (
  taskId: TaskId | null,
  projectId: ProjectId
): readonly ReduxStoreTask[] =>
  useSelector(({ tasks }: ReduxStoreState) => {
    const comparator = (task1: ReduxStoreTask, task2: ReduxStoreTask) =>
      task1.name.localeCompare(task2.name);
    if (taskId === null) {
      return Object.values(tasks)
        .filter(task => task.projectId === projectId)
        .sort(comparator);
    }
    const reverseDependencySet = getTransitiveReverseDependencyTaskIds(tasks, taskId);
    return Object.values(tasks)
      .filter(task => !reverseDependencySet.has(task.taskId) && task.projectId === projectId)
      .sort(comparator);
  });
