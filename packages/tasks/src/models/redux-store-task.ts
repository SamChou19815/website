import { TaskId, createTaskId } from './ids';
import { ReduxStoreTasksMap } from './redux-store-types';

const dfs = (
  startId: TaskId,
  childrenGetter: (taskId: TaskId) => readonly TaskId[]
): Set<TaskId> => {
  const visitedSet = new Set<TaskId>();
  const dfsStack = [startId];
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const toBeVisitedId = dfsStack.pop();
    if (toBeVisitedId == null) {
      break;
    }
    visitedSet.add(toBeVisitedId);
    childrenGetter(toBeVisitedId).forEach(dependency => {
      if (visitedSet.has(dependency)) {
        return;
      }
      dfsStack.push(dependency);
    });
  }
  return visitedSet;
};

export const getTransitiveDependencyTaskIds = (
  map: ReduxStoreTasksMap,
  taskId: TaskId
): Set<TaskId> => dfs(taskId, id => map[id]?.dependencies ?? []);

export const getTransitiveReverseDependencyTaskIds = (
  map: ReduxStoreTasksMap,
  taskId: TaskId
): Set<TaskId> => {
  const reverseDependencyGraph: { [key: string]: TaskId[] } = {};
  Object.entries(map).forEach(([id, task]) => {
    const parentId = createTaskId(id);
    task.dependencies.forEach(dependency => {
      const list = reverseDependencyGraph[dependency];
      if (list == null) {
        reverseDependencyGraph[dependency] = [parentId];
      } else {
        list.push(parentId);
      }
    });
  });
  return dfs(taskId, id => reverseDependencyGraph[id] ?? []);
};
