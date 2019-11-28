import { Directory, DirectoryStack, FileSystemState } from './types';

export const stripRoot = (path: string): string =>
  path.startsWith('/') ? path.substring(1) : path;

export const normalize = (path: string): string =>
  path.endsWith('/') ? path.substring(0, path.length - 1) : path;

/**
 * @param segment1 first segment of path.
 * @param segment2 second segment of path.
 * @returns joint path.
 */
export const join = (segment1: string, segment2: string): string =>
  segment2.startsWith('/') ? normalize(segment2) : `${normalize(segment1)}/${normalize(segment2)}`;

/**
 *
 * @param state the current stack.
 * @returns a string representation of the current directory path.
 */
export const currentStackDirectoryPath = (stack: DirectoryStack): string => {
  const simpleAnswer = stack.map(([pathSegment]) => pathSegment).join('/');
  return simpleAnswer === '' ? '/' : simpleAnswer;
};

/**
 *
 * @param state the current filesystem state of the terminal.
 * @returns a string representation of the current directory path.
 */
export const currentDirectoryPath = ({ stack }: FileSystemState): string =>
  currentStackDirectoryPath(stack);
