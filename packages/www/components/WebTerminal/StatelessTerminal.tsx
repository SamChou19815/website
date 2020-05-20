// Modified from https://github.com/js-rcon/react-console-emulator/blob/master/lib/Terminal.jsx

import React, { ReactElement, RefObject } from 'react';

import styles from './Terminal.module.css';
import TerminalInput from './TerminalInput';
import { TerminalHistory } from './types';

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

type Props = {
  readonly history: readonly TerminalHistory[];
  readonly terminalRoot: RefObject<HTMLDivElement>;
  readonly terminalInput: RefObject<HTMLInputElement>;
  readonly focusTerminal: () => void;
  readonly onArrow: (arrow: 'up' | 'down') => string | null;
  readonly processCommand: (line: string) => void;
};

export default ({
  history,
  terminalRoot,
  terminalInput,
  focusTerminal,
  onArrow,
  processCommand,
}: Props): ReactElement => (
  <div className={styles.TerminalContainer}>
    <div className={styles.TerminalTitle}>Terminal</div>
    <div role="presentation" ref={terminalRoot} className={styles.Terminal} onClick={focusTerminal}>
      <div className={styles.TerminalContent}>
        {history.map(({ isCommand, line }, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <TerminalHistoryLine key={index} isCommand={isCommand} line={line} />
        ))}
        <TerminalInput terminalInput={terminalInput} onArrow={onArrow} onSubmit={processCommand} />
      </div>
    </div>
  </div>
);
