import { FirestoreTask } from './firestore-types';
import { createTaskId } from './ids';
import { ReduxStoreTask } from './redux-store-types';

export const fromNewReduxStoreTask = ({
  projectId,
  owner,
  name,
  content,
  completed,
  dependencies
}: Omit<ReduxStoreTask, 'taskId'>): FirestoreTask => ({
  projectId,
  owner,
  name,
  content,
  completed,
  dependencies
});

export const fromPartialReduxStoreTask = ({
  projectId,
  owner,
  name,
  content,
  completed,
  dependencies
}: Partial<ReduxStoreTask>): Partial<FirestoreTask> => {
  const partial: Partial<{ -readonly [P in keyof FirestoreTask]: FirestoreTask[P] }> = {};
  if (projectId !== undefined) {
    partial.projectId = projectId;
  }
  if (owner !== undefined) {
    partial.owner = owner;
  }
  if (name !== undefined) {
    partial.name = name;
  }
  if (content !== undefined) {
    partial.content = content;
  }
  if (completed !== undefined) {
    partial.completed = completed;
  }
  if (dependencies !== undefined) {
    partial.dependencies = dependencies;
  }
  return partial;
};

export const toReduxStoreTask = ({
  taskId,
  owner,
  projectId,
  name,
  content,
  completed,
  dependencies
}: FirestoreTask & { readonly taskId: string }): ReduxStoreTask => ({
  taskId: createTaskId(taskId),
  owner,
  projectId,
  name,
  content,
  completed,
  dependencies
});
