import { changeDirectory, currentDirectoryPath, listFiles, showFiles } from '../in-memory-fs';
import { getFilesystemState, setFilesystemState } from './global-filesystem-state';
import type { Commands } from './types';

const baseCommands: Commands = {
  cat: {
    fn: (...paths: string[]): readonly string[] | string => {
      try {
        return showFiles(getFilesystemState(), paths);
      } catch (exception) {
        return (exception instanceof Error && exception.message) || 'Unknown Error';
      }
    },
    description: 'Concatenate and print files',
    usage: 'cat [path1] [path2] ...',
  },

  cd: {
    fn: (path: string | undefined): string | void => {
      try {
        setFilesystemState(changeDirectory(getFilesystemState(), path || '/'));
        return undefined;
      } catch (exception) {
        return (exception instanceof Error && exception.message) || 'Unknown Error';
      }
    },
    description: 'Change current directory.',
    usage: 'cd [path]',
  },

  echo: {
    fn: (...inputs: string[]): string => inputs.join(' '),
    description: 'Print back the arguments.',
    usage: 'echo [foo] [bar] ...',
  },

  ls: {
    fn: (...paths: string[]): readonly string[] | string => {
      try {
        return listFiles(getFilesystemState(), paths);
      } catch (exception) {
        return (exception instanceof Error && exception.message) || 'Unknown Error';
      }
    },
    description: 'List directory contents.',
    usage: 'ls [path1] [path2] ...',
  },

  pwd: {
    fn: (): string => currentDirectoryPath(getFilesystemState()),
    description: 'Print currrent absolute directory.',
    usage: 'pwd',
  },
};

export default baseCommands;
