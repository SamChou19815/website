import { Commands } from 'react-console-emulator';
import { initialState, currentDirectoryPath, changeDirectory, listFiles } from '../../filesystem';

let fileSystemState = initialState;

const cd = (path: string): string | null => {
  try {
    fileSystemState = changeDirectory(fileSystemState, path);
    return null;
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
  cd: { fn: cd, description: 'Change current directory.', usage: 'cd [path]' },
  'dev-sam': { fn: devSam, description: 'You guess what it is.' },
  echo: { fn: echo, description: 'Print back the arguments.', usage: 'echo [foo] [bar] ...' },
  ls: { fn: ls, description: 'List directory contents.', usage: 'ls [path1] [path2] ...' },
  pwd: { fn: pwd, description: 'Print currrent absolute directory.' }
};

export default commands;
