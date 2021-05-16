import React, { useState } from 'react';

import StatefulTerminal from './StatefulTerminal';

const memoizedTerminal = <StatefulTerminal />;

const HiddenByDefaultWebTerminal = (): JSX.Element => {
  const [isTerminalShown, setIsTerminalShown] = useState(false);
  const toggle = (): void => setIsTerminalShown((isShown) => !isShown);

  return (
    <>
      <button type="button" onClick={toggle} className="web-terminal-trigger-button">
        <span className="web-terminal-first-edge" />
        <span className="web-terminal-second-edge" />
        <span className="web-terminal-text">Terminal Toggle</span>
      </button>
      {isTerminalShown && memoizedTerminal}
    </>
  );
};

export default HiddenByDefaultWebTerminal;
