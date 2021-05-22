import { changeDirectory, peek } from './stack';
import type { Directory, FileSystemState } from './types';

export const listFilesInDirectory = (directory: Directory): readonly string[] =>
  directory.children.map(([filename, file]) =>
    file.type === 'DIRECTORY' ? `${filename}/` : filename
  );

export const listFilesInDirectoryWithRelativePath = (
  state: FileSystemState,
  path: string
): readonly string[] => listFilesInDirectory(peek(changeDirectory(state, path))[1]);

const listFiles = (state: FileSystemState, pathList: readonly string[]): readonly string[] => {
  if (pathList.length === 0) {
    return listFilesInDirectory(peek(state)[1]);
  }
  if (pathList.length === 1) {
    const onlySegment = pathList[0];
    if (onlySegment == null) throw new Error();
    return listFilesInDirectoryWithRelativePath(state, onlySegment);
  }
  return pathList
    .map((path) => [`${path}:`, ...listFilesInDirectoryWithRelativePath(state, path)])
    .flat();
};

export default listFiles;
