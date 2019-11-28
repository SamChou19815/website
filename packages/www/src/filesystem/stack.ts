import { DirectoryStack } from './types';
import { normalize, join, currentStackDirectoryPath } from './path';

/**
 * Change the directory stack for one level.
 *
 * @param stack the current directory stack.
 * @param filename the filename of the directory to go into.
 * @returns the new directory stack.
 * @throws if it's an invalid operation.
 */
export const changeDirectoryOneLevel = (
  stack: DirectoryStack,
  filename: string
): DirectoryStack => {
  if (filename === '.') {
    return stack;
  }
  if (filename === '..') {
    return stack.length <= 1 ? stack : stack.slice(0, stack.length - 1);
  }
  const currentDirectory = stack[stack.length - 1][1];
  const foundFileWithName = currentDirectory.children.find(
    ([localFilename]) => localFilename === filename
  );
  if (foundFileWithName == null) {
    throw new Error(
      `${filename} is not found in directory: \`${currentStackDirectoryPath(stack)}\`.`
    );
  }
  const foundFile = foundFileWithName[1];
  if (foundFile.type === 'TEXT_FILE') {
    throw new Error(`\`${join(currentStackDirectoryPath(stack), filename)}\` is not a directory.`);
  }
  return [...stack, [filename, foundFile]];
};

/**
 * Change the directory stack according to `path`.
 *
 * @param stack the current filesystem state of the terminal.
 * @param path the absolute or relative path to `cd` into.
 * @returns the new directory stack.
 * @throws if it's an invalid operation.
 */
export const changeDirectory = (stack: DirectoryStack, path: string): DirectoryStack => {
  if (path.startsWith('/')) {
    // The case for absolute directory.
    // We start from root, and then use the same relative algorithm.
    return changeDirectory(stack, path.substring(1));
  }
  return normalize(path)
    .split('/')
    .reduce((accumulator, filename) => changeDirectoryOneLevel(accumulator, filename), stack);
};
