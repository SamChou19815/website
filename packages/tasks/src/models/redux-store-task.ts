import { TaskId, createTaskId } from './ids';
import { ReduxStoreTasksMap, ReduxStoreTask } from './redux-store-types';

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
  visitedSet.delete(startId);
  return visitedSet;
};

export const getTransitiveDependencyTaskIds = (
  map: ReduxStoreTasksMap,
  taskId: TaskId
): Set<TaskId> => dfs(taskId, id => map[id]?.dependencies ?? []);

type DependencyGraph = { readonly [key: string]: readonly TaskId[] };

const buildReverseDependencyGraph = (map: ReduxStoreTasksMap): DependencyGraph => {
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
  return reverseDependencyGraph;
};

export const getTransitiveReverseDependencyTaskIds = (
  map: ReduxStoreTasksMap,
  taskId: TaskId
): Set<TaskId> => {
  const reverseDependencyGraph = buildReverseDependencyGraph(map);
  return dfs(taskId, id => reverseDependencyGraph[id] ?? []);
};

const reversedleveledTopologicalSort = (tasks: readonly ReduxStoreTask[]): ReduxStoreTask[][] => {
  const taskMap: { [key: string]: ReduxStoreTask } = {};
  tasks.forEach(task => {
    taskMap[task.taskId] = task;
  });
  if (tasks.every(task => task.dependencies.every(taskId => taskMap[taskId] == null))) {
    // If every task in the level is independent from each other, directly return.
    return [[...tasks]];
  }
  const reverseDependencyGraph = buildReverseDependencyGraph(taskMap);
  const reversedLevels: ReduxStoreTask[][] = [];
  let currentLevelStack: ReduxStoreTask[] = tasks.filter(
    task => (reverseDependencyGraph[task.taskId]?.length ?? 0) === 0
  );
  const visitedTaskId = new Set<TaskId>();
  while (currentLevelStack.length > 0) {
    const deduplicatedCurrentLevelStack: ReduxStoreTask[] = [];
    const nextLevelStack: ReduxStoreTask[] = [];
    currentLevelStack.forEach(task => {
      const { taskId, dependencies } = task;
      if (visitedTaskId.has(taskId)) {
        return;
      }
      visitedTaskId.add(taskId);
      deduplicatedCurrentLevelStack.push(task);
      dependencies.forEach(dependencyTaskId => {
        const dependentTask = taskMap[dependencyTaskId];
        if (dependentTask != null) {
          nextLevelStack.push(dependentTask);
        }
      });
    });
    // This is used to avoid direction arrows in the same level.
    reversedLevels.push(...reversedleveledTopologicalSort(deduplicatedCurrentLevelStack));
    currentLevelStack = nextLevelStack;
  }
  return reversedLevels;
};

export const leveledTopologicalSort = (
  tasks: readonly ReduxStoreTask[]
): readonly (readonly ReduxStoreTask[])[] => {
  return reversedleveledTopologicalSort(tasks).reverse();
};

export const flattenedTopologicalSort = (
  tasks: readonly ReduxStoreTask[]
): readonly ReduxStoreTask[] => leveledTopologicalSort(tasks).flat(1);
