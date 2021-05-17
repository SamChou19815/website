import React, { ReactNode, useEffect } from 'react';

import DATASET_ABOUT from '../data/about';
import DATASET_PROJECTS from '../data/projects';
import DATASET_TECH_TALKS from '../data/tech-talks';
import DATASET_TIMELINE from '../data/timeline';
import { useSetTerminalForceOnBirthday } from './global-states';
import WebTerminal from './web-terminal';
import { WebTerminalCommandsContextProvider } from './web-terminal/WebTerminalCommandsContext';
import baseCommands from './web-terminal/base-commands';

import type { Commands } from './web-terminal/types';

const devSam = (command: string): readonly ReactNode[] | ReactNode | void => {
  const information = `Copyright (C) 2015-${new Date().getFullYear()} Developer Sam. All rights reserved.`;
  switch (command) {
    case 'about':
      return [
        'Random Facts:',
        ...DATASET_ABOUT.facts.map(({ text }) => `- ${text}`),
        'External Links:',
        ...DATASET_ABOUT.links.map(({ href, text }) => `- [${text}](${href})`),
      ];
    case 'projects':
    case 'project':
      return DATASET_PROJECTS.flatMap(({ name, type, description, links }) => [
        `${type} ${name}`,
        `- ${description}`,
        '- Links:',
        ...links.map(({ text, href }) => `  - [${text}](${href})`),
      ]);
    case 'tech-talks':
    case 'tech-talk':
      return DATASET_TECH_TALKS.flatMap(({ title, description, link }) => [
        title,
        `- ${description}`,
        `- Slide: ${link}`,
      ]);
    case 'timeline':
      return DATASET_TIMELINE.map(({ title, time }) => `${time}: ${title}`);
    case undefined:
      return [information];
    default:
      return [`Supported commands: about, projects, tech-talks, timeline.\n${information}`];
  }
};

const TIME_OF_OCT_14_2020_7PM = 1602630000000;

const DevMegan = (): JSX.Element => {
  return (
    <>
      <div>
        Time together: {Math.floor((new Date().getTime() - TIME_OF_OCT_14_2020_7PM) / 86400000)}{' '}
        days.
      </div>
      <div>{"Sam loves Megan's drawings. 💕"}</div>
      <div>
        <img
          src="/fan-arts/dev-sam-birthday-edition.webp"
          height={200}
          alt="@dev-sam/fan-art Birthday Edition"
          title="@dev-sam/fan-art Birthday Edition"
        />
        <img
          src="/fan-arts/dev-sam-fan-art-3.webp"
          height={200}
          alt="@dev-sam/fan-art Iteration 3"
          title="@dev-sam/fan-art Iteration 3"
        />
        <img
          src="/fan-arts/dev-sam-fan-art-2.webp"
          height={200}
          alt="@dev-sam/fan-art Iteration 2"
          title="@dev-sam/fan-art Iteration 2"
        />
        <img
          src="/fan-arts/dev-sam-fan-art-1.webp"
          height={200}
          alt="@dev-sam/fan-art Iteration 1"
          title="@dev-sam/fan-art Iteration 1"
        />
      </div>
      <a href="https://meganyin.com">{"Visit Megan's Website!"}</a>
    </>
  );
};

const devMegan = (): JSX.Element => <DevMegan />;

const ForceBirthdayDummyComponent = (): JSX.Element => {
  const setForceOnBirthday = useSetTerminalForceOnBirthday();

  useEffect(() => {
    setForceOnBirthday((forced) => !forced);
  }, [setForceOnBirthday]);

  return <>Toggled birthday state!</>;
};

const forceBirthday = (): JSX.Element => <ForceBirthdayDummyComponent />;

const commands: Commands = {
  ...baseCommands,
  'dev-sam': { fn: devSam, description: 'You guess what it is.' },
  'dev-megan': {
    fn: devMegan,
    description: (
      <img
        src="/emojis/devmegan.webp"
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

const WebTerminalAppWrapper = (): JSX.Element => (
  <WebTerminalCommandsContextProvider value={commands}>
    <WebTerminal />
  </WebTerminalCommandsContextProvider>
);

export default WebTerminalAppWrapper;
