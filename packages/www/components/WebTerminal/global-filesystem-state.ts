import { initialState } from '../../filesystem';
import type { FileSystemState } from '../../filesystem/types';

let mutableFilesystemState = initialState;

export const getFilesystemState = (): FileSystemState => mutableFilesystemState;

export const setFilesystemState = (state: FileSystemState): void => {
  mutableFilesystemState = state;
};
