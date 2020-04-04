import { createStore, Store } from 'redux';

import { AppQueue, ReduxStoreState } from './types';

type ReduxStoreAction = {
  readonly type: 'PATCH_QUEUES';
  readonly queues: readonly AppQueue[];
};

export const getPatchAction = (queues: readonly AppQueue[]): ReduxStoreAction => ({
  type: 'PATCH_QUEUES',
  queues,
});

const initialState: ReduxStoreState = { dataLoaded: false, queues: [] };

const rootReducer = (
  state: ReduxStoreState = initialState,
  action: ReduxStoreAction
): ReduxStoreState => {
  switch (action.type) {
    case 'PATCH_QUEUES':
      return { ...state, queues: action.queues, dataLoaded: true };
    default:
      return state;
  }
};

/** The redux store. It should only be given to the react-redux provider. */
export const store: Store<ReduxStoreState, ReduxStoreAction> = createStore(rootReducer);
