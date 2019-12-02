import { Commands } from './types';
import { store, patchTimeline, patchFileSystem } from '../../store';
import { currentDirectoryPath, changeDirectory, listFiles, showFiles } from '../../filesystem';

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
    return showFiles(store.getState().fileSystem, paths);
  } catch (exception) {
    return exception.message;
  }
};

const cd = (path: string | undefined): string | void => {
  try {
    patchFileSystem(changeDirectory(store.getState().fileSystem, path || '/'));
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
    return listFiles(store.getState().fileSystem, paths);
  } catch (exception) {
    return exception.message;
  }
};

const pwd = (): string => currentDirectoryPath(store.getState().fileSystem);

const timeline = (...args: string[]): string | void => {
  if (args.length === 0) {
    patchTimeline({ workChecked: true, projectsChecked: true, eventsChecked: true });
    return undefined;
  }
  if (args.length === 1 && args[0] === '--none') {
    patchTimeline({ workChecked: false, projectsChecked: false, eventsChecked: false });
    return undefined;
  }
  if (args[0] !== '--only') {
    return 'Invalid command.';
  }
  const invalidArguments: string[] = [];
  let workChecked = false;
  let projectsChecked = false;
  let eventsChecked = false;
  for (let i = 1; i < args.length; i += 1) {
    const argument = args[i];
    switch (argument) {
      case 'work':
        workChecked = true;
        break;
      case 'projects':
        projectsChecked = true;
        break;
      case 'events':
        eventsChecked = true;
        break;
      default:
        invalidArguments.push(argument);
    }
  }
  if (invalidArguments.length > 0) {
    return `Bad argument(s) for --only: ${invalidArguments.join(', ')}`;
  }
  patchTimeline({ workChecked, projectsChecked, eventsChecked });
  return undefined;
};

const commands: Commands = {
  help: { fn: help, description: 'Show a list of available commands.' },
  cat: { fn: cat, description: 'Concatenate and print files', usage: 'cat [path1] [path2] ...' },
  cd: { fn: cd, description: 'Change current directory.', usage: 'cd [path]' },
  'dev-sam': { fn: devSam, description: 'You guess what it is.' },
  echo: { fn: echo, description: 'Print back the arguments.', usage: 'echo [foo] [bar] ...' },
  ls: { fn: ls, description: 'List directory contents.', usage: 'ls [path1] [path2] ...' },
  pwd: { fn: pwd, description: 'Print currrent absolute directory.' },
  timeline: { fn: timeline, description: 'Toggle timeline display' }
};

export default commands;
