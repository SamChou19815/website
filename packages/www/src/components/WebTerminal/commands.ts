import { Commands } from './types';
import { FileSystemState } from '../../filesystem/types';
import {
  initialState,
  currentDirectoryPath,
  changeDirectory,
  listFiles,
  showFiles
} from '../../filesystem';

let fileSystemState = initialState;

export const getFileSystemState = (): FileSystemState => fileSystemState;

const help = (): string =>
  Object.keys(commands)
    .map(key => {
      const cmdObj = commands[key];
      const usage = cmdObj.usage ? ` - ${cmdObj.usage}` : '';
      return `${key} - ${cmdObj.description}${usage}`;
    })
    .join('\n');

const cat = (...paths: string[]): string => {
  try {
    return showFiles(fileSystemState, paths);
  } catch (exception) {
    return exception.message;
  }
};

const cd = (path: string): string | void => {
  try {
    fileSystemState = changeDirectory(fileSystemState, path);
    return undefined;
  } catch (exception) {
    return exception.message;
  }
};

const devSam = (): string =>
  `Copyright (C) 2015–${new Date().getFullYear()} Developer Sam. All rights reserved.`;

const echo = (...inputs: string[]): string => inputs.join(' ');

const ls = (...paths: string[]): string => {
  try {
    return listFiles(fileSystemState, paths);
  } catch (exception) {
    return exception.message;
  }
};

const pwd = (): string => currentDirectoryPath(fileSystemState);

const commands: Commands = {
  help: { fn: help, description: 'Show a list of available commands.' },
  cat: { fn: cat, description: 'Concatenate and print files', usage: 'cat [path1] [path2] ...' },
  cd: { fn: cd, description: 'Change current directory.', usage: 'cd [path]' },
  'dev-sam': { fn: devSam, description: 'You guess what it is.' },
  echo: { fn: echo, description: 'Print back the arguments.', usage: 'echo [foo] [bar] ...' },
  ls: { fn: ls, description: 'List directory contents.', usage: 'ls [path1] [path2] ...' },
  pwd: { fn: pwd, description: 'Print currrent absolute directory.' }
};

export default commands;
