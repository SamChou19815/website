// Modified from https://github.com/js-rcon/react-console-emulator/blob/master/lib/Terminal.jsx

import React, { ReactElement, useRef, useState } from 'react';
import TerminalInput from './TerminalInput';
import { TerminalHistory } from './types';
import commands from './commands';
import scrollHistory from './history';
import styles from './Terminal.module.css';

const TerminalHistoryLine = ({ isCommand, line }: TerminalHistory): ReactElement => {
  if (!isCommand) {
    return <p className={styles.TerminalMessage}>{line}</p>;
  }
  return (
    <p className={styles.TerminalMessage}>
      <span className={styles.TerminalPromptLabel}>$</span>
      {line}
    </p>
  );
};

type State = {
  readonly history: readonly TerminalHistory[];
  readonly historyPosition: number | null;
  readonly previousHistoryPosition: number | null;
};

const initialState: State = {
  history: [{ isCommand: false, line: 'Type `help` to show a list of available commands.' }],
  historyPosition: null,
  previousHistoryPosition: null
};

export default (): ReactElement => {
  const [state, setState] = useState<State>(initialState);
  const terminalRoot = useRef<HTMLDivElement>(null);
  const terminalInput = useRef<HTMLInputElement>(null);

  const processCommand = (inputLine: string): void => {
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

    setState(
      (oldState: State): State => ({
        ...state,
        history: [...oldState.history, ...newHistoryItems],
        historyPosition: null
      })
    );
    scrollToBottom();
    focusTerminal();
  };

  const historyUpDown = (direction: 'up' | 'down'): string | null => {
    const { history, historyPosition, previousHistoryPosition } = state;
    const { value, ...update } = scrollHistory(
      direction,
      history,
      historyPosition,
      previousHistoryPosition
    );
    setState({ ...state, ...update });
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
    <div className={styles.TerminalContainer}>
      <div className={styles.TerminalTitle}>Terminal</div>
      <div
        role="presentation"
        ref={terminalRoot}
        className={styles.Terminal}
        onClick={focusTerminal}
      >
        <div className={styles.TerminalContent}>
          {state.history.map(({ isCommand, line }, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <TerminalHistoryLine key={index} isCommand={isCommand} line={line} />
          ))}
          <TerminalInput
            terminalInput={terminalInput}
            onArrow={historyUpDown}
            onSubmit={processCommand}
          />
        </div>
      </div>
    </div>
  );
};
