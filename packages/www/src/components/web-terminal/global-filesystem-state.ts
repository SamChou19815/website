import { initialState } from '../in-memory-fs';

import type { FileSystemState } from '../in-memory-fs/types';

let mutableFilesystemState = initialState;

export const getFilesystemState = (): FileSystemState => mutableFilesystemState;

export const setFilesystemState = (state: FileSystemState): void => {
  mutableFilesystemState = state;
};
