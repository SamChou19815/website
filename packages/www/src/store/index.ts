import { createStore, Store } from 'redux';

import { initialState as initialFileSystem } from '../filesystem';
import { FileSystemState } from '../filesystem/types';

export type TimelineState = {
  readonly workChecked: boolean;
  readonly projectsChecked: boolean;
  readonly eventsChecked: boolean;
};

export type State = {
  readonly timeline: TimelineState;
  readonly fileSystem: FileSystemState;
};

const initialState: State = {
  timeline: { workChecked: true, projectsChecked: true, eventsChecked: true },
  fileSystem: initialFileSystem
};

export type Action =
  | { readonly type: 'PATCH_TIMELINE'; readonly timeline: TimelineState }
  | { readonly type: 'PATCH_FILESYSTEM'; readonly fileSystem: FileSystemState };

const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case 'PATCH_TIMELINE':
      return { ...state, timeline: action.timeline };
    case 'PATCH_FILESYSTEM':
      return { ...state, fileSystem: action.fileSystem };
    default:
      return state;
  }
};

export type GlobalStore = Store<State, Action>;

const store: GlobalStore = createStore(reducer);
const patchTimeline = (timeline: TimelineState): Action =>
  store.dispatch({ type: 'PATCH_TIMELINE', timeline });
const patchFileSystem = (fileSystem: FileSystemState): Action =>
  store.dispatch({ type: 'PATCH_FILESYSTEM', fileSystem });

export { store, patchTimeline, patchFileSystem };
