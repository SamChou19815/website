import React, { ReactElement, ReactNode } from 'react';

import DATASET_ABOUT from '../data/about';
import DATASET_PROJECTS from '../data/projects';
import DATASET_TECH_TALKS from '../data/tech-talks';
import { TimelineItemType, getFilteredTimeline } from '../data/timeline';

import WebTerminal from 'lib-web-terminal';
import { WebTerminalCommandsContextProvider } from 'lib-web-terminal/WebTerminalCommandsContext';
import baseCommands from 'lib-web-terminal/base-commands';
import type { Commands } from 'lib-web-terminal/types';

const devSam = (command: string, ...commandArguments: readonly string[]): string | void => {
  const information = `Copyright (C) 2015–${new Date().getFullYear()} Developer Sam. All rights reserved.`;
  switch (command) {
    case 'about': {
      const facts = DATASET_ABOUT.facts.map(({ text }) => `- ${text}`).join('\n');
      const links = DATASET_ABOUT.links.map(({ href, text }) => `- [${text}](${href})`).join('\n');
      return `Random Facts:\n${facts}\nExternal Links:\n${links}`;
    }
    case 'projects':
      return DATASET_PROJECTS.map(
        ({ name, type, description }) => `${name}:\n- ${type}\n- ${description}`
      ).join('\n');
    case 'tech-talks':
      return DATASET_TECH_TALKS.map(
        ({ title, type, description }) => `${title}:\n- ${type}\n- ${description}`
      ).join('\n');
    case 'timeline':
      return timeline(...commandArguments);
    case undefined:
      return information;
    default:
      return `Supported commands: about, projects, tech-talk, timeline.\n${information}`;
  }
};

const timeline = (...args: string[]): string | void => {
  if (args.length === 0) {
    return getFilteredTimeline(['work', 'project', 'event'])
      .map(({ title, time }) => `${time}: ${title}`)
      .join('\n');
  }
  if (args.length === 1 && args[0] === '--none') {
    return undefined;
  }
  if (args[0] !== '--only') {
    return 'Invalid command.';
  }
  const invalidArguments: string[] = [];
  const types: TimelineItemType[] = [];
  for (let i = 1; i < args.length; i += 1) {
    const argument = args[i];
    switch (argument) {
      case 'work':
        types.push('work');
        break;
      case 'projects':
        types.push('project');
        break;
      case 'events':
        types.push('event');
        break;
      default:
        invalidArguments.push(argument);
    }
  }
  if (invalidArguments.length > 0) {
    return `Bad argument(s) for --only: ${invalidArguments.join(', ')}`;
  }
  return getFilteredTimeline(types)
    .map(({ title, time }) => `${time}: ${title}`)
    .join('\n');
};

const commands: Commands = {
  ...baseCommands,
  'dev-sam': { fn: devSam, description: 'You guess what it is.' },
};

const WebTerminalAppWrapper = ({ children }: { readonly children: ReactNode }): ReactElement => (
  <WebTerminalCommandsContextProvider value={commands}>
    {children}
    <WebTerminal />
  </WebTerminalCommandsContextProvider>
);

export default WebTerminalAppWrapper;
