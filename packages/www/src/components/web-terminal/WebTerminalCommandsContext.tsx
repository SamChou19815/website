import { assertNotNull, checkNotNull } from 'lib-common';
import React, { ReactNode, Provider, createContext, useContext } from 'react';

import type { Commands } from './types';

const WebTerminalCommandsContext = createContext<Commands | null>(null);

export const useWebTerminalCommands = (): Commands => {
  const commands = useContext(WebTerminalCommandsContext);
  assertNotNull(commands);

  // Patch help command into commands, to provide help for all commands.

  const help = (): readonly ReactNode[] =>
    Object.keys(commandsWithHelp).map((key) => {
      const cmdObj = checkNotNull(commandsWithHelp[key]);
      const usage = cmdObj.usage ? ` - ${cmdObj.usage}` : '';
      return (
        <>
          {key} -&nbsp;{cmdObj.description}
          {usage}
        </>
      );
    });

  const commandsWithHelp: Commands = {
    ...commands,
    help: { fn: help, description: 'Show a list of available commands.' },
  };

  return commandsWithHelp;
};

export const WebTerminalCommandsContextProvider: Provider<Commands | null> =
  WebTerminalCommandsContext.Provider;
