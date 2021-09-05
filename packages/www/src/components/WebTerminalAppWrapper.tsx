import React from 'react';

import WebTerminal from './web-terminal';
import { WebTerminalCommandsContextProvider } from './web-terminal/WebTerminalCommandsContext';
import baseCommands from './web-terminal/base-commands';
import type { Commands } from './web-terminal/types';

const devSam = () =>
  `Copyright (C) 2015-${new Date().getFullYear()} Developer Sam. All rights reserved.`;

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

const devMegan = () => <DevMegan />;

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
};

const WebTerminalAppWrapper = (): JSX.Element => (
  <WebTerminalCommandsContextProvider value={commands}>
    <WebTerminal />
  </WebTerminalCommandsContextProvider>
);

export default WebTerminalAppWrapper;
