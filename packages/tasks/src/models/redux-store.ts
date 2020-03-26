import { createStore, Store } from 'redux';

import { toReduxStoreProject } from './firestore-project';
import { toReduxStoreTask } from './firestore-task';
import { FirestoreProjectWithId, FirestoreTaskWithId } from './firestore-types';
import { ReduxStoreProjectsMap, ReduxStoreTasksMap, ReduxStoreState } from './redux-store-types';

type PatchProjectsAction = {
  readonly type: 'PATCH_PROJECTS';
  readonly createdAndEdited: readonly FirestoreProjectWithId[];
  readonly deleted: readonly string[];
};
type PatchTasksAction = {
  readonly type: 'PATCH_TASKS';
  readonly createdAndEdited: readonly FirestoreTaskWithId[];
  readonly deleted: readonly string[];
};
type SignalDataLoadedAction = { readonly type: 'DATA_LOADED' };
type ReduxStoreAction = PatchProjectsAction | PatchTasksAction | SignalDataLoadedAction;

export const getPatchProjectsAction = (
  createdAndEdited: readonly FirestoreProjectWithId[],
  deleted: readonly string[]
): ReduxStoreAction => ({
  type: 'PATCH_PROJECTS',
  createdAndEdited,
  deleted,
});

export const getPatchTasksAction = (
  createdAndEdited: readonly FirestoreTaskWithId[],
  deleted: readonly string[]
): ReduxStoreAction => ({
  type: 'PATCH_TASKS',
  createdAndEdited,
  deleted,
});

export const signalDataLoadedAction: SignalDataLoadedAction = { type: 'DATA_LOADED' };

const patchProjects = (
  projects: ReduxStoreProjectsMap,
  action: PatchProjectsAction
): ReduxStoreProjectsMap => {
  const projectsMutableCopy = { ...projects };
  action.createdAndEdited.forEach((firestoreProject) => {
    projectsMutableCopy[firestoreProject.projectId] = toReduxStoreProject(firestoreProject);
  });
  action.deleted.forEach((projectId) => delete projectsMutableCopy[projectId]);
  return projectsMutableCopy;
};

const patchTasks = (tasks: ReduxStoreTasksMap, action: PatchTasksAction): ReduxStoreTasksMap => {
  const tasksMutableCopy = { ...tasks };
  action.createdAndEdited.forEach((firestoreTask) => {
    tasksMutableCopy[firestoreTask.taskId] = toReduxStoreTask(firestoreTask);
  });
  action.deleted.forEach((taskId) => delete tasksMutableCopy[taskId]);
  return tasksMutableCopy;
};

const initialState: ReduxStoreState = { dataLoaded: false, projects: {}, tasks: {} };

const rootReducer = (
  state: ReduxStoreState = initialState,
  action: ReduxStoreAction
): ReduxStoreState => {
  switch (action.type) {
    case 'PATCH_PROJECTS':
      return { ...state, projects: patchProjects(state.projects, action) };
    case 'PATCH_TASKS':
      return { ...state, tasks: patchTasks(state.tasks, action) };
    case 'DATA_LOADED':
      return { ...state, dataLoaded: true };
    default:
      return state;
  }
};

/** The redux store. It should only be given to the react-redux provider. */
export const store: Store<ReduxStoreState, ReduxStoreAction> = createStore(rootReducer);
