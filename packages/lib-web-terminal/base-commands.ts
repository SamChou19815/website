import { getFilesystemState, setFilesystemState } from './global-filesystem-state';
import type { Commands } from './types';

import {
  currentDirectoryPath,
  changeDirectory,
  listFiles,
  showFiles,
} from 'lib-in-memory-filesystem';

const cat = (...paths: string[]): string => {
  try {
    return showFiles(getFilesystemState(), paths);
  } catch (exception) {
    return exception.message;
  }
};

const cd = (path: string | undefined): string | void => {
  try {
    setFilesystemState(changeDirectory(getFilesystemState(), path || '/'));
    return undefined;
  } catch (exception) {
    return exception.message;
  }
};

const echo = (...inputs: string[]): string => inputs.join(' ');

const ls = (...paths: string[]): string => {
  try {
    return listFiles(getFilesystemState(), paths);
  } catch (exception) {
    return exception.message;
  }
};

const pwd = (): string => currentDirectoryPath(getFilesystemState());

const baseCommands: Commands = {
  cat: { fn: cat, description: 'Concatenate and print files', usage: 'cat [path1] [path2] ...' },
  cd: { fn: cd, description: 'Change current directory.', usage: 'cd [path]' },
  echo: { fn: echo, description: 'Print back the arguments.', usage: 'echo [foo] [bar] ...' },
  ls: { fn: ls, description: 'List directory contents.', usage: 'ls [path1] [path2] ...' },
  pwd: { fn: pwd, description: 'Print currrent absolute directory.' },
};

export default baseCommands;
