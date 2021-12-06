// Modified from https://github.com/js-rcon/react-console-emulator/blob/master/lib/Terminal.jsx

import React, { RefObject } from 'react';
import TerminalInput from './TerminalInput';
import type { TerminalHistory } from './types';

const TerminalHistoryLine = ({
  history: { isCommand, line },
}: {
  readonly history: TerminalHistory;
}): JSX.Element => {
  const className = 'm-0 leading-6';
  if (!isCommand) {
    if (typeof line === 'string') return <p className={className}>{line}</p>;
    return <div className={className}>{line}</div>;
  }
  return (
    <p className={className}>
      <span className="text-blue-500 pr-2">$</span>
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
  <div ref={terminalRoot} className="h-screen" onClick={focusTerminal}>
    <div className="sticky top-0 p-2 text-center border-b border-solid border-gray-300 inherit-background">
      Terminal
    </div>
    <div className="p-5 font-mono">
      {history.map((oneHistoryLine, index) => (
        <TerminalHistoryLine key={index} history={oneHistoryLine} />
      ))}
      <TerminalInput terminalInput={terminalInput} onArrow={onArrow} onSubmit={processCommand} />
    </div>
  </div>
);

export default StatelessTerminal;
