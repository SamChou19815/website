import { FirestoreTask } from './firestore-types';
import { createTaskId } from './ids';
import { ReduxStoreTask } from './redux-store-types';

export const fromNewReduxStoreTask = ({
  owner,
  name,
  color,
  content,
  status,
  dependencies,
}: Omit<ReduxStoreTask, 'taskId'>): FirestoreTask => ({
  owner,
  name,
  color,
  content,
  status,
  dependencies,
});

export const fromPartialReduxStoreTask = ({
  owner,
  name,
  color,
  content,
  status,
  dependencies,
}: Partial<ReduxStoreTask>): Partial<FirestoreTask> => {
  const partial: Partial<{ -readonly [P in keyof FirestoreTask]: FirestoreTask[P] }> = {};
  if (owner !== undefined) {
    partial.owner = owner;
  }
  if (name !== undefined) {
    partial.name = name;
  }
  if (color !== undefined) {
    partial.color = color;
  }
  if (content !== undefined) {
    partial.content = content;
  }
  if (status !== undefined) {
    partial.status = status;
  }
  if (dependencies !== undefined) {
    partial.dependencies = dependencies;
  }
  return partial;
};

export const toReduxStoreTask = ({
  taskId,
  owner,
  name,
  color,
  content,
  status,
  dependencies,
}: FirestoreTask & { readonly taskId: string }): ReduxStoreTask => ({
  taskId: createTaskId(taskId),
  owner,
  name,
  color,
  content,
  status,
  dependencies,
});
