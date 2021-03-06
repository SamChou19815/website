import type { FileSystemState } from './types';

export const stripRoot = (path: string): string =>
  path.startsWith('/') ? path.substring(1) : path;

export const normalize = (path: string): string =>
  path.endsWith('/') ? path.substring(0, path.length - 1) : path;

export const getParent = (path: string): string => {
  const normalizedPath = normalize(path);
  if (normalizedPath.indexOf('/') === -1) {
    return '.';
  }
  const index = normalizedPath.lastIndexOf('/');
  const result = normalize(index === -1 ? '/' : normalizedPath.substring(0, index));
  return result === '' ? '/' : result;
};

export const getLast = (path: string): string => {
  const normalizedPath = normalize(path);
  const index = normalizedPath.lastIndexOf('/');
  const result = normalize(index === -1 ? normalizedPath : normalizedPath.substring(index + 1));
  return result === '' ? '/' : result;
};

/**
 * @param segment1 first segment of path.
 * @param segment2 second segment of path.
 * @returns joint path.
 */
export const join = (segment1: string, segment2: string): string =>
  segment2.startsWith('/') ? normalize(segment2) : `${normalize(segment1)}/${normalize(segment2)}`;

/**
 *
 * @param state the current filesystem state of the terminal.
 * @returns a string representation of the current directory path.
 */
export const currentDirectoryPath = (state: FileSystemState): string => {
  const simpleAnswer = state.map(([pathSegment]) => pathSegment).join('/');
  return simpleAnswer === '' ? '/' : simpleAnswer;
};
