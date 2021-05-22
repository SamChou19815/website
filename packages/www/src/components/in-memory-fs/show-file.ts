import initialState from './initial-state';
import { getParent, getLast, join, currentDirectoryPath } from './path';
import { changeDirectory, peek } from './stack';
import type { Directory, FileSystemState } from './types';

export const showFileInDirectory = (directory: Directory, filename: string): string | null => {
  const foundFileWithName = directory.children.find(
    ([localFilename]) => localFilename === filename
  );
  if (foundFileWithName == null) {
    return null;
  }
  const foundFile = foundFileWithName[1];
  return foundFile.type === 'DIRECTORY' ? null : foundFile.text;
};

const showFiles = (state: FileSystemState, pathList: readonly string[]): readonly string[] => {
  return pathList.map((path) => {
    const parent = getParent(path);
    const stack = parent === '/' ? initialState : changeDirectory(state, parent);
    const directory = peek(stack)[1];
    const filename = getLast(path);
    const content = showFileInDirectory(directory, filename);
    if (content === null) {
      throw new Error(
        `\`${join(currentDirectoryPath(stack), filename)}\` cannot be found or is not a text file.`
      );
    }
    return content;
  });
};

export default showFiles;
