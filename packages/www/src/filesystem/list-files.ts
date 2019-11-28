import { Directory, FileSystemState } from './types';
import { changeDirectory, peek } from './stack';

export const listFilesInDirectory = (directory: Directory): string =>
  directory.children
    .map(([filename, file]) => (file.type === 'DIRECTORY' ? `${filename}/` : filename))
    .join('\n');

export const listFilesInDirectoryWithRelativePath = (
  state: FileSystemState,
  path: string
): string => listFilesInDirectory(peek(changeDirectory(state, path))[1]);

const listFiles = (state: FileSystemState, pathList: readonly string[]): string => {
  if (pathList.length === 0) {
    return listFilesInDirectory(peek(state)[1]);
  }
  if (pathList.length === 1) {
    return listFilesInDirectoryWithRelativePath(state, pathList[0]);
  }
  return pathList
    .map(path => `${path}:\n${listFilesInDirectoryWithRelativePath(state, path)}`)
    .join('\n\n');
};

export default listFiles;
