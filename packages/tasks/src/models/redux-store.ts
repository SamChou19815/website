import { createStore, Store } from 'redux';

import { toReduxStoreTask } from './firestore-task';
import { FirestoreTaskWithId } from './firestore-types';
import { ReduxStoreTasksMap, ReduxStoreState } from './redux-store-types';

type PatchTasksAction = {
  readonly type: 'PATCH_TASKS';
  readonly createdAndEdited: readonly FirestoreTaskWithId[];
  readonly deleted: readonly string[];
};
type ReduxStoreAction = PatchTasksAction;

export const getPatchTasksAction = (
  createdAndEdited: readonly FirestoreTaskWithId[],
  deleted: readonly string[]
): ReduxStoreAction => ({
  type: 'PATCH_TASKS',
  createdAndEdited,
  deleted,
});

const patchTasks = (tasks: ReduxStoreTasksMap, action: PatchTasksAction): ReduxStoreTasksMap => {
  const tasksMutableCopy = { ...tasks };
  action.createdAndEdited.forEach((firestoreTask) => {
    tasksMutableCopy[firestoreTask.taskId] = toReduxStoreTask(firestoreTask);
  });
  action.deleted.forEach((taskId) => delete tasksMutableCopy[taskId]);
  return tasksMutableCopy;
};

const initialState: ReduxStoreState = { dataLoaded: false, tasks: {} };

const rootReducer = (
  state: ReduxStoreState = initialState,
  action: ReduxStoreAction
): ReduxStoreState => {
  switch (action.type) {
    case 'PATCH_TASKS':
      return { ...state, dataLoaded: true, tasks: patchTasks(state.tasks, action) };
    default:
      return state;
  }
};

/** The redux store. It should only be given to the react-redux provider. */
export const store: Store<ReduxStoreState, ReduxStoreAction> = createStore(rootReducer);
