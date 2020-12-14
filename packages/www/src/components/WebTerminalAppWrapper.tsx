import { ReactElement, ReactNode, useEffect } from 'react';

import DATASET_ABOUT from '../data/about';
import { TimelineItemType, getFilteredTimeline } from '../data/timeline';
import ProjectsSection from './ProjectsSection';
import TechTalkSection from './TechTalkSection';
import { useSetTerminalForceOnBirthday } from './global-states';

import { checkNotNull } from 'lib-common';
import WebTerminal from 'lib-web-terminal';
import { WebTerminalCommandsContextProvider } from 'lib-web-terminal/WebTerminalCommandsContext';
import baseCommands from 'lib-web-terminal/base-commands';
import type { Commands } from 'lib-web-terminal/types';

const devSam = (
  command: string,
  ...commandArguments: readonly string[]
): readonly ReactNode[] | ReactNode | void => {
  const information = `Copyright (C) 2015–${new Date().getFullYear()} Developer Sam. All rights reserved.`;
  switch (command) {
    case 'about':
      return [
        'Random Facts:',
        ...DATASET_ABOUT.facts.map(({ text }) => `- ${text}`),
        'External Links:',
        ...DATASET_ABOUT.links.map(({ href, text }) => `- [${text}](${href})`),
      ];
    case 'projects':
      return <ProjectsSection />;
    case 'tech-talks':
      return <TechTalkSection />;
    case 'timeline':
      return timeline(...commandArguments);
    case undefined:
      return [information];
    default:
      return [`Supported commands: about, projects, tech-talk, timeline.\n${information}`];
  }
};

const timeline = (...args: string[]): readonly string[] | void => {
  if (args.length === 0) {
    return getFilteredTimeline(['work', 'project', 'event']).map(
      ({ title, time }) => `${time}: ${title}`
    );
  }
  if (args.length === 1 && args[0] === '--none') {
    return undefined;
  }
  if (args[0] !== '--only') {
    return ['Invalid command.'];
  }
  const invalidArguments: string[] = [];
  const types: TimelineItemType[] = [];
  for (let i = 1; i < args.length; i += 1) {
    const argument = checkNotNull(args[i]);
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
    return [`Bad argument(s) for --only: ${invalidArguments.join(', ')}`];
  }
  return getFilteredTimeline(types).map(({ title, time }) => `${time}: ${title}`);
};

const devMegan = (): ReactElement => <a href="https://meganyin.com">{"Visit Megan's Website!"}</a>;

const ForceBirthdayDummyComponent = (): ReactElement => {
  const setForceOnBirthday = useSetTerminalForceOnBirthday();

  useEffect(() => {
    setForceOnBirthday((forced) => !forced);
  }, [setForceOnBirthday]);

  return <>Toggled birthday state!</>;
};

const forceBirthday = (): ReactElement => <ForceBirthdayDummyComponent />;

const commands: Commands = {
  ...baseCommands,
  'dev-sam': { fn: devSam, description: 'You guess what it is.' },
  'dev-megan': {
    fn: devMegan,
    description: (
      <img
        src="/emojis/devmegan.png"
        width={20}
        height={20}
        style={{ marginBottom: '-4px' }}
        alt="dev-megan"
      />
    ),
  },
  'birthday-toggle': {
    fn: forceBirthday,
    description: "Make the website to believe that today is Sam's birthday, or reset the belief.",
  },
};

const WebTerminalAppWrapper = ({ children }: { readonly children: ReactNode }): ReactElement => (
  <WebTerminalCommandsContextProvider value={commands}>
    {children}
    <WebTerminal />
  </WebTerminalCommandsContextProvider>
);

export default WebTerminalAppWrapper;
