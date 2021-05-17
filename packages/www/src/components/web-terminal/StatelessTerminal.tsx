// Modified from https://github.com/js-rcon/react-console-emulator/blob/master/lib/Terminal.jsx

import React, { RefObject } from 'react';

import TerminalInput from './TerminalInput';

import type { TerminalHistory } from './types';

const TerminalHistoryLine = ({
  history: { isCommand, line },
}: {
  readonly history: TerminalHistory;
}): JSX.Element => {
  if (!isCommand) {
    if (typeof line === 'string') return <p className="web-terminal-message">{line}</p>;
    return <div className="web-terminal-message">{line}</div>;
  }
  return (
    <p className="web-terminal-message">
      <span className="web-terminal-prompt-label">$</span>
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

const StatelessTerminal = ({
  history,
  terminalRoot,
  terminalInput,
  focusTerminal,
  onArrow,
  processCommand,
}: Props): JSX.Element => (
  <div className="web-terminal-container">
    <div className="web-terminal-title">Terminal</div>
    <div
      role="presentation"
      ref={terminalRoot}
      className="web-terminal-body"
      onClick={focusTerminal}
    >
      <div className="web-terminal-content">
        {history.map((oneHistoryLine, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <TerminalHistoryLine key={index} history={oneHistoryLine} />
        ))}
        <TerminalInput terminalInput={terminalInput} onArrow={onArrow} onSubmit={processCommand} />
      </div>
    </div>
  </div>
);

export default StatelessTerminal;
