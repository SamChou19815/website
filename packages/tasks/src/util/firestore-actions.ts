import { fromNewReduxStoreProject } from '../models/firestore-project';
import { fromNewReduxStoreTask } from '../models/firestore-task';
import { store } from '../models/redux-store';
import { ReduxStoreProject, ReduxStoreTask } from '../models/redux-store-types';
import { projectsCollection, tasksCollection, createBatch } from './firestore';

export const createProject = (project: Omit<ReduxStoreProject, 'projectId'>): void => {
  projectsCollection.add(fromNewReduxStoreProject(project));
};

export const editProject = (project: ReduxStoreProject): void => {
  projectsCollection.doc(project.projectId).update(fromNewReduxStoreProject(project));
};

export const deleteProject = (projectId: string): void => {
  const batch = createBatch();
  batch.delete(projectsCollection.doc(projectId));
  Object.values(store.getState().tasks)
    .filter(task => task.projectId === projectId)
    .forEach(task => batch.delete(tasksCollection.doc(task.taskId)));
  batch.commit();
};

export const createTask = (task: Omit<ReduxStoreTask, 'taskId'>): void => {
  tasksCollection.add(fromNewReduxStoreTask(task));
};

export const editTask = (task: ReduxStoreTask): void => {
  tasksCollection.doc(task.taskId).update(fromNewReduxStoreTask(task));
};

export const deleteTask = (taskId: string): void => {
  tasksCollection.doc(taskId).delete();
};
