import { FileSystemState } from './types';
import { changeDirectory } from './stack';

/**
 * Works like `cd`.
 *
 * @param state the current filesystem state of the terminal.
 * @param path the absolute or relative path to `cd` into.
 * @returns the new filesystem state.
 * @throws if it's an invalid operation.
 */
const cd = (state: FileSystemState, path: string): FileSystemState => ({
  root: state.root,
  stack: changeDirectory(state.stack, path)
});

// eslint-disable-next-line import/prefer-default-export
export { cd };
