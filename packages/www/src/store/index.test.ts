import { store, patchTimeline, patchFileSystem } from '.';
import { initialState, changeDirectory } from '../filesystem';

it('patchTimeline works.', () => {
  patchTimeline({ workChecked: false, projectsChecked: false, eventsChecked: false });
  expect(store.getState().timeline).toStrictEqual({
    workChecked: false,
    projectsChecked: false,
    eventsChecked: false,
  });
});

it('patchFileSystem works.', () => {
  const newFileSystem = changeDirectory(initialState, 'top-secret');
  patchFileSystem(newFileSystem);
  expect(store.getState().fileSystem).toStrictEqual(newFileSystem);
});
