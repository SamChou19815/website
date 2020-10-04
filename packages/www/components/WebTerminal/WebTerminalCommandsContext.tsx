import { Provider, createContext, useContext } from 'react';

import type { Commands } from './types';

const WebTerminalCommandsContext = createContext<Commands | null>(null);

export const useWebTerminalCommands = (): Commands => {
  const commands = useContext(WebTerminalCommandsContext);
  if (commands == null) throw new Error();
  return commands;
};

export const WebTerminalCommandsContextProvider: Provider<Commands | null> =
  WebTerminalCommandsContext.Provider;
