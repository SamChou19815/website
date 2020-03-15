import { FirestoreTask } from './firestore-types';
import { ReduxStoreTask } from './redux-store-types';
import { createTaskId } from './ids';

export const fromNewReduxStoreTask = ({
  projectId,
  name,
  content,
  completed,
  dependencies
}: ReduxStoreTask): FirestoreTask => ({
  projectId,
  name,
  content,
  completed,
  dependencies
});

export const fromPartialReduxStoreTask = ({
  projectId,
  name,
  content,
  completed,
  dependencies
}: Partial<ReduxStoreTask>): Partial<FirestoreTask> => ({
  projectId,
  name,
  content,
  completed,
  dependencies
});

export const toReduxStoreTask = ({
  taskId,
  projectId,
  name,
  content,
  completed,
  dependencies
}: FirestoreTask & { readonly taskId: string }): ReduxStoreTask => ({
  taskId: createTaskId(taskId),
  projectId,
  name,
  content,
  completed,
  dependencies
});
