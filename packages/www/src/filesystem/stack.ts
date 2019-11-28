import { FileSystemState } from './types';
import { normalize, join, currentDirectoryPath } from './path';

/**
 * Change the directory stack for one level.
 *
 * @param state the current filesystem state of the terminal.
 * @param filename the filename of the directory to go into.
 * @returns the new filesystem state.
 * @throws if it's an invalid operation.
 */
export const changeDirectoryOneLevel = (
  state: FileSystemState,
  filename: string
): FileSystemState => {
  if (filename === '.') {
    return state;
  }
  if (filename === '..') {
    return state.length <= 1 ? state : state.slice(0, state.length - 1);
  }
  const currentDirectory = state[state.length - 1][1];
  const foundFileWithName = currentDirectory.children.find(
    ([localFilename]) => localFilename === filename
  );
  if (foundFileWithName == null) {
    throw new Error(`${filename} is not found in directory: \`${currentDirectoryPath(state)}\`.`);
  }
  const foundFile = foundFileWithName[1];
  if (foundFile.type === 'TEXT_FILE') {
    throw new Error(`\`${join(currentDirectoryPath(state), filename)}\` is not a directory.`);
  }
  return [...state, [filename, foundFile]];
};

/**
 * Change the directory stack according to `path`.
 *
 * @param state the current filesystem state of the terminal.
 * @param path the absolute or relative path to `cd` into.
 * @returns the new filesystem state.
 * @throws if it's an invalid operation.
 */
export const changeDirectory = (state: FileSystemState, path: string): FileSystemState => {
  if (path.startsWith('/')) {
    // The case for absolute directory.
    // We start from root, and then use the same relative algorithm.
    return changeDirectory(state, path.substring(1));
  }
  return normalize(path)
    .split('/')
    .reduce((accumulator, filename) => changeDirectoryOneLevel(accumulator, filename), state);
};
