// Based on https://github.com/js-rcon/react-console-emulator/blob/master/lib/Terminal.jsx

/* eslint-disable react/destructuring-assignment */
import React, { Component, ReactElement, KeyboardEvent, RefObject } from 'react';
import { Commands } from './types';
import scrollHistory from './history';
import styles from './Terminal.module.css';

type State = {
  readonly history: readonly string[];
  readonly stdout: string[];
  readonly historyPosition: number | null;
  readonly previousHistoryPosition: number | null;
};

const initialState: State = {
  stdout: ['Type `help` to show a list of available commands.'],
  history: [],
  historyPosition: null,
  previousHistoryPosition: null
};

export default class Terminal extends Component<{ readonly commands: Commands }, State> {
  // eslint-disable-next-line react/state-in-constructor
  public state: State = initialState;

  // Used for auto-scrolling.
  terminalRoot: RefObject<HTMLDivElement> = React.createRef();

  // Used for getting input of uncontrolled input element.
  terminalInput: RefObject<HTMLInputElement> = React.createRef();

  private focusTerminal = (): void => {
    // Only focus the terminal if text isn't being copied
    const selection = window.getSelection();
    const node = this.terminalInput.current;
    if (selection === null) {
      return;
    }
    if (selection.type !== 'Range' && node !== null) {
      node.focus();
    }
  };

  private scrollToBottom = (): void => {
    const rootNode = this.terminalRoot.current;
    if (rootNode == null) {
      return;
    }
    // This may look ridiculous, but it is necessary to decouple
    // execution for just a millisecond in order to scroll all the way.
    setTimeout(() => {
      rootNode.scrollTop = rootNode.scrollHeight;
    }, 1);
  };

  private pushToStdout = (message: string, rawInput?: string | undefined): void =>
    this.setState(
      (state: State): State => {
        const { stdout, history } = state;
        stdout.push(message);
        if (!rawInput) {
          return { ...state, stdout };
        }
        const newHistory = [...history, rawInput];
        return { ...state, stdout, history: newHistory, historyPosition: null };
      }
    );

  private getStdout = (): ReactElement[] =>
    this.state.stdout.map((line: string, index: number) => (
      // eslint-disable-next-line react/no-array-index-key
      <p key={index} className={styles.TerminalMessage}>
        {line}
      </p>
    ));

  private clearInput = (): void => {
    this.setState({ historyPosition: null });
    const inputNode = this.terminalInput.current;
    if (inputNode == null) {
      return;
    }
    inputNode.value = '';
  };

  private processCommand = (): void => {
    const terminalInput = this.terminalInput.current;
    if (terminalInput == null) {
      throw new Error();
    }
    const rawInput = terminalInput.value.trim();

    this.pushToStdout(`$ ${rawInput}`, rawInput);

    if (rawInput) {
      const input = rawInput.split(' ');
      const command = input[0];
      const args = input.slice(1);

      const cmdObj = this.props.commands[command];

      if (cmdObj == null) {
        this.pushToStdout(`Command '${command}' not found!`);
      } else {
        const result = cmdObj.fn(...args);
        if (result != null) {
          result.split('\n').forEach(line => this.pushToStdout(line));
        }
      }
    }

    this.clearInput();
    this.scrollToBottom();
    this.focusTerminal();
  };

  private scrollHistory = (direction: 'up' | 'down'): void => {
    const toUpdate = scrollHistory(
      direction,
      this.state.history,
      this.state.historyPosition,
      this.state.previousHistoryPosition,
      this.terminalInput
    );
    this.setState(toUpdate);
  };

  private handleInput = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'Enter':
        this.processCommand();
        break;
      case 'ArrowUp':
        this.scrollHistory('up');
        break;
      case 'ArrowDown':
        this.scrollHistory('down');
        break;
      default:
        break;
    }
  };

  render() {
    return (
      <div
        role="presentation"
        ref={this.terminalRoot}
        className={styles.Terminal}
        onClick={this.focusTerminal}
      >
        {/* Content */}
        <div className={styles.TerminalContent}>
          {/* Stdout */}
          {this.getStdout()}
          {/* Input area */}
          <div className={styles.TerminalInputArea}>
            {/* Prompt label */}
            <span className={styles.TerminalPromptLabel}>$</span>
            {/* Input */}
            <input
              ref={this.terminalInput}
              className={styles.TerminalInput}
              onKeyDown={this.handleInput}
              type="text"
              autoComplete="off"
            />
          </div>
        </div>
      </div>
    );
  }
}
