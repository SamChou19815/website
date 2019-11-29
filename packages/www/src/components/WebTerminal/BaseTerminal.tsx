// Modified from https://github.com/js-rcon/react-console-emulator/blob/master/lib/Terminal.jsx

import React, { ReactElement, KeyboardEvent, useRef, useState } from 'react';
import { Commands } from './types';
import scrollHistory from './history';
import styles from './Terminal.module.css';

type State = {
  readonly history: readonly string[];
  readonly stdout: readonly string[];
  readonly historyPosition: number | null;
  readonly previousHistoryPosition: number | null;
};

const initialState: State = {
  stdout: ['Type `help` to show a list of available commands.'],
  history: [],
  historyPosition: null,
  previousHistoryPosition: null
};

export default ({ commands }: { readonly commands: Commands }): ReactElement => {
  const [state, setState] = useState<State>(initialState);
  const terminalRoot = useRef<HTMLDivElement>(null);
  const terminalInput = useRef<HTMLInputElement>(null);

  const pushToStdout = (messages: readonly string[], rawInput: string): void =>
    setState(
      (oldState: State): State => {
        const { stdout, history } = oldState;
        const newStdout = [...stdout, ...messages];
        const newHistory = [...history, rawInput];
        return { ...state, stdout: newStdout, history: newHistory, historyPosition: null };
      }
    );

  const processCommand = (): void => {
    const inputNode = terminalInput.current;
    if (inputNode == null) {
      throw new Error();
    }
    const rawInput = inputNode.value.trim();
    const newMessages: string[] = [];
    newMessages.push(`$ ${rawInput}`);

    if (rawInput) {
      const input = rawInput.split(' ');
      const commandName = input[0];
      const args = input.slice(1);

      const command = commands[commandName];
      if (command == null) {
        newMessages.push(`Command '${command}' not found!`);
      } else {
        const result = command.fn(...args);
        if (result != null) {
          result.split('\n').forEach(line => newMessages.push(line));
        }
      }
    }

    pushToStdout(newMessages, rawInput);
    clearInput();
    scrollToBottom();
    focusTerminal();
  };

  const historyUpDown = (direction: 'up' | 'down'): void =>
    setState(oldState => {
      const { history, historyPosition, previousHistoryPosition } = oldState;
      const update = scrollHistory(
        direction,
        history,
        historyPosition,
        previousHistoryPosition,
        terminalInput
      );
      return { ...oldState, ...update };
    });

  const handleInput = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'Enter':
        processCommand();
        break;
      case 'ArrowUp':
        historyUpDown('up');
        break;
      case 'ArrowDown':
        historyUpDown('down');
        break;
      default:
        break;
    }
  };

  const clearInput = (): void => {
    setState(oldState => ({ ...oldState, historyPosition: null }));
    const inputNode = terminalInput.current;
    if (inputNode == null) {
      return;
    }
    inputNode.value = '';
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
    <div role="presentation" ref={terminalRoot} className={styles.Terminal} onClick={focusTerminal}>
      {/* Content */}
      <div className={styles.TerminalContent}>
        {/* Stdout */}
        {state.stdout.map((line: string, index: number) => (
          // eslint-disable-next-line react/no-array-index-key
          <p key={index} className={styles.TerminalMessage}>
            {line}
          </p>
        ))}
        {/* Input area */}
        <div className={styles.TerminalInputArea}>
          {/* Prompt label */}
          <span className={styles.TerminalPromptLabel}>$</span>
          {/* Input */}
          <input
            ref={terminalInput}
            className={styles.TerminalInput}
            onKeyDown={handleInput}
            type="text"
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
};
