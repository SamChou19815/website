import { initialState } from 'lib-in-memory-filesystem';
import type { FileSystemState } from 'lib-in-memory-filesystem/types';

let mutableFilesystemState = initialState;

export const getFilesystemState = (): FileSystemState => mutableFilesystemState;

export const setFilesystemState = (state: FileSystemState): void => {
  mutableFilesystemState = state;
};
