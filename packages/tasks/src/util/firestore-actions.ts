import { fromNewReduxStoreTask, fromPartialReduxStoreTask } from '../models/firestore-task';
import { FirestoreTask } from '../models/firestore-types';
import { TaskId } from '../models/ids';
import { ReduxStoreTask } from '../models/redux-store-types';
import { tasksCollection } from './firestore';

export const createTask = (task: Omit<ReduxStoreTask, 'taskId'>): void => {
  tasksCollection.add(fromNewReduxStoreTask(task));
};

export const editTask = (task: Partial<FirestoreTask> & { readonly taskId: TaskId }): void => {
  tasksCollection.doc(task.taskId).update(fromPartialReduxStoreTask(task));
};

export const deleteTask = (taskId: string): void => {
  tasksCollection.doc(taskId).delete();
};
