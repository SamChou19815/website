import { ReduxStoreProject } from '../models/redux-store-types';
import { store } from '../models/redux-store';
import { projectsCollection, tasksCollection, createBatch } from './firestore';
import { fromNewReduxStoreProject } from '../models/firestore-project';

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
