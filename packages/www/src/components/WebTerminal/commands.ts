import { Commands } from 'react-console-emulator';
import { initialState, changeDirectory } from '../../filesystem';

let fileSystemState = initialState;

const echo = (...inputs: string[]): string => inputs.join(' ');

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

const commands: Commands = {
  echo: { fn: echo, description: 'Print back the arguments.', usage: 'echo [foo] [bar] ...' },
  cd: { fn: cd, description: 'Change current directory', usage: 'cd [path]' },
  'dev-sam': { fn: devSam, description: 'You guess', usage: 'dev-sam' }
};

export default commands;
