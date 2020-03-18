// Modified from https://github.com/js-rcon/react-console-emulator/blob/master/lib/Terminal.jsx

import React, { ReactElement, useRef, useState } from 'react';

import StatelessTerminal from './StatelessTerminal';
import commands from './commands';
import scrollHistory from './history';
import { TerminalHistory } from './types';

const initialHistory: readonly TerminalHistory[] = [
  { isCommand: false, line: 'Type `help` to show a list of available commands.' }
];

const getNewHistory = (inputLine: string): readonly TerminalHistory[] => {
  const rawCommandLineInput = inputLine.trim();
  const newHistoryItems: TerminalHistory[] = [];
  newHistoryItems.push({ isCommand: true, line: rawCommandLineInput });

  if (rawCommandLineInput) {
    const input = rawCommandLineInput.split(' ');
    const commandName = input[0];
    const args = input.slice(1);

    const command = commands[commandName];
    if (command == null) {
      newHistoryItems.push({ isCommand: false, line: `Command '${commandName}' not found!` });
    } else {
      const result = command.fn(...args);
      if (result != null) {
        result.split('\n').forEach(line => newHistoryItems.push({ isCommand: false, line }));
      }
    }
  }
  return newHistoryItems;
};

export default (): ReactElement => {
  const [history, setHistory] = useState(initialHistory);
  const terminalRoot = useRef<HTMLDivElement>(null);
  const terminalInput = useRef<HTMLInputElement>(null);
  const historyPositionRef = useRef<number | null>(null);

  const processCommand = (inputLine: string): void => {
    historyPositionRef.current = null;
    setHistory(oldHistory => [...oldHistory, ...getNewHistory(inputLine)]);
    scrollToBottom();
    focusTerminal();
  };

  const historyUpDown = (direction: 'up' | 'down'): string | null => {
    const simplifiedHistory = Array.from(history)
      .filter(({ isCommand }) => isCommand)
      .map(item => item.line)
      .reverse();
    const result = scrollHistory(direction, simplifiedHistory, historyPositionRef.current);
    if (result === null) {
      return null;
    }
    const { value, historyPosition: newHistoryPosition } = result;
    historyPositionRef.current = newHistoryPosition;
    return value;
  };

  const scrollToBottom = (): void => {
    const rootNode = terminalRoot.current;
    if (rootNode == null) {
      return;
    }
    // This may look ridiculous, but it is necessary to decouple
    // execution for just a millisecond in order to scroll all the way.
    setTimeout(() => {
      rootNode.scrollTop = rootNode.scrollHeight;
    }, 1);
  };

  const focusTerminal = (): void => {
    // Only focus the terminal if text isn't being copied.
    const selection = window.getSelection();
    const node = terminalInput.current;
    if (selection === null) {
      return;
    }
    if (selection.type !== 'Range' && node !== null) {
      node.focus();
    }
  };

  return (
    <StatelessTerminal
      history={history}
      terminalRoot={terminalRoot}
      terminalInput={terminalInput}
      focusTerminal={focusTerminal}
      onArrow={historyUpDown}
      processCommand={processCommand}
    />
  );
};
