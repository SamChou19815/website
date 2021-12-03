import React, { useState } from 'react';

import StatefulTerminal from './StatefulTerminal';

const memoizedTerminal = <StatefulTerminal />;

export default function HiddenByDefaultWebTerminal(): JSX.Element {
  /*
  const [isTerminalShown, setIsTerminalShown] = useState(false);
  const toggle = (): void => setIsTerminalShown((isShown) => !isShown);

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        className="fixed z-20 bottom-4 right-4 outline-none cursor-pointer block w-6 h-6 p-1 bg-gray-400"
      >
        <span className="web-terminal-first-edge" />
        <span className="web-terminal-second-edge" />
        <span className="web-terminal-text">Terminal Toggle</span>
      </button>
      {isTerminalShown && memoizedTerminal}
    </>
  );
  */
  return memoizedTerminal;
}
