import { createStore, Store } from 'redux';
import { AllFirestoreUserData } from './firestore-types';
import { ReduxStoreState } from './redux-store-types';
import { toReduxStoreProject } from './firestore-project';
import { toReduxStoreTask } from './firestore-task';

type ReduxStoreAction = { readonly type: 'PATCH_USER_DATA' } & AllFirestoreUserData;

export const patchAction = ({ projects, tasks }: AllFirestoreUserData): ReduxStoreAction => ({
  type: 'PATCH_USER_DATA',
  projects,
  tasks
});

const rootReducer = (
  state: ReduxStoreState = { projects: [], tasks: [] },
  action: ReduxStoreAction
): ReduxStoreState => {
  switch (action.type) {
    case 'PATCH_USER_DATA':
      return {
        ...state,
        projects: action.projects.map(toReduxStoreProject),
        tasks: action.tasks.map(toReduxStoreTask)
      };
    default:
      return state;
  }
};

/** The redux store. It should only be given to the react-redux provider. */
export const store: Store<ReduxStoreState, ReduxStoreAction> = createStore(rootReducer);
