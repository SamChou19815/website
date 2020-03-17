import { createStore, Store } from 'redux';
import { FirestoreProjectWithId, FirestoreTaskWithId } from './firestore-types';
import { ReduxStoreState } from './redux-store-types';
import { toReduxStoreProject } from './firestore-project';
import { toReduxStoreTask } from './firestore-task';

type ReduxStoreAction =
  | { readonly type: 'PATCH_PROJECTS'; readonly projects: readonly FirestoreProjectWithId[] }
  | { readonly type: 'PATCH_TASKS'; readonly tasks: readonly FirestoreTaskWithId[] };

export const patchProjects = (projects: readonly FirestoreProjectWithId[]): ReduxStoreAction => ({
  type: 'PATCH_PROJECTS',
  projects
});

export const patchTasks = (tasks: readonly FirestoreTaskWithId[]): ReduxStoreAction => ({
  type: 'PATCH_TASKS',
  tasks
});

const rootReducer = (
  state: ReduxStoreState = { projects: [], tasks: [] },
  action: ReduxStoreAction
): ReduxStoreState => {
  switch (action.type) {
    case 'PATCH_PROJECTS':
      return {
        ...state,
        projects: action.projects.map(toReduxStoreProject)
      };
    case 'PATCH_TASKS':
      return {
        ...state,
        tasks: action.tasks.map(toReduxStoreTask)
      };
    default:
      return state;
  }
};

/** The redux store. It should only be given to the react-redux provider. */
export const store: Store<ReduxStoreState, ReduxStoreAction> = createStore(rootReducer);
