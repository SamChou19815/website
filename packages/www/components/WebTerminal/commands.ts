import about from '../../data/about';
import projects from '../../data/projects';
import techTalks from '../../data/tech-talks';
import { TimelineItemType, getFilteredTimeline } from '../../data/timeline';
import { currentDirectoryPath, changeDirectory, listFiles, showFiles } from '../../filesystem';
import { store, patchTimeline, patchFileSystem } from '../../store';
import { Commands } from './types';

const help = (): string =>
  Object.keys(commands)
    .map((key) => {
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

const devSam = (command: string, ...commandArguments: readonly string[]): string | void => {
  const information = `Copyright (C) 2015–${new Date().getFullYear()} Developer Sam. All rights reserved.`;
  switch (command) {
    case 'about': {
      const facts = about.facts.map(({ text }) => `${text}`).join('\n');
      const links = about.links.map(({ href, text }) => `[${text}](${href})`).join('\n');
      return `Random Facts:\n${facts}\nExternal Links:\n${links}`;
    }
    case 'projects':
      return projects
        .map(({ name, type, description }) => `${name}:\n> ${type}\n> ${description}`)
        .join('\n');
    case 'tech-talks':
      return techTalks
        .map(({ title, type, description }) => `${title}:\n> ${type}\n> ${description}`)
        .join('\n');
    case 'timeline':
      return timeline(...commandArguments);
    case undefined:
      return information;
    default:
      return `Supported commands: about, projects, tech-talk, timeline.\n${information}`;
  }
};

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
    return getFilteredTimeline(['work', 'project', 'event'])
      .map(({ title, time }) => `${time}: ${title}`)
      .join('\n');
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
  const types: TimelineItemType[] = [];
  for (let i = 1; i < args.length; i += 1) {
    const argument = args[i];
    switch (argument) {
      case 'work':
        workChecked = true;
        types.push('work');
        break;
      case 'projects':
        projectsChecked = true;
        types.push('project');
        break;
      case 'events':
        eventsChecked = true;
        types.push('event');
        break;
      default:
        invalidArguments.push(argument);
    }
  }
  if (invalidArguments.length > 0) {
    return `Bad argument(s) for --only: ${invalidArguments.join(', ')}`;
  }
  patchTimeline({ workChecked, projectsChecked, eventsChecked });
  return getFilteredTimeline(types)
    .map(({ title, time }) => `${time}: ${title}`)
    .join('\n');
};

const commands: Commands = {
  help: { fn: help, description: 'Show a list of available commands.' },
  cat: { fn: cat, description: 'Concatenate and print files', usage: 'cat [path1] [path2] ...' },
  cd: { fn: cd, description: 'Change current directory.', usage: 'cd [path]' },
  'dev-sam': { fn: devSam, description: 'You guess what it is.' },
  echo: { fn: echo, description: 'Print back the arguments.', usage: 'echo [foo] [bar] ...' },
  ls: { fn: ls, description: 'List directory contents.', usage: 'ls [path1] [path2] ...' },
  pwd: { fn: pwd, description: 'Print currrent absolute directory.' },
};

export default commands;
