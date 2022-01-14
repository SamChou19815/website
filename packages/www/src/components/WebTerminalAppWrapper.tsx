import React, { useEffect } from 'react';
import baseCommands from './web-terminal/base-commands';
import StatefulTerminal from './web-terminal/StatefulTerminal';
import type { Commands } from './web-terminal/types';
import { WebTerminalCommandsContextProvider } from './web-terminal/WebTerminalCommandsContext';

const devSam = () =>
  `Copyright (C) 2015-${new Date().getFullYear()} Developer Sam. All rights reserved.`;

function Home(): JSX.Element {
  useEffect(() => {
    window.location.href = '/';
  }, []);
  return <div>Redirecting...</div>;
}

const commands: Commands = {
  ...baseCommands,
  home: { fn: () => <Home />, description: 'Redirect to homepage.' },
  'dev-sam': { fn: devSam, description: 'You guess what it is.' },
};

export default function WebTerminalAppWrapper(): JSX.Element {
  return (
    <WebTerminalCommandsContextProvider value={commands}>
      <StatefulTerminal />
    </WebTerminalCommandsContextProvider>
  );
}
