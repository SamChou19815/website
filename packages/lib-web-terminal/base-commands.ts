import { getFilesystemState, setFilesystemState } from './global-filesystem-state';
import type { Commands } from './types';

import {
  currentDirectoryPath,
  changeDirectory,
  listFiles,
  showFiles,
} from 'lib-in-memory-filesystem';

const baseCommands: Commands = {
  cat: {
    fn: (...paths: string[]): readonly string[] | string => {
      try {
        return showFiles(getFilesystemState(), paths);
      } catch (exception) {
        return exception.message;
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
        return exception.message;
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
    fn: (...paths: string[]): readonly string[] => {
      try {
        return listFiles(getFilesystemState(), paths);
      } catch (exception) {
        return exception.message;
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
