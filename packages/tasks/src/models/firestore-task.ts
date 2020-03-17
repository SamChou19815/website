import { FirestoreTask } from './firestore-types';
import { ReduxStoreTask } from './redux-store-types';
import { createTaskId } from './ids';

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
}: Partial<ReduxStoreTask>): Partial<FirestoreTask> => ({
  projectId,
  owner,
  name,
  content,
  completed,
  dependencies
});

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
