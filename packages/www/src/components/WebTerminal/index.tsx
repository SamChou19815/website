import React, { ReactElement, useState, useMemo } from 'react';
import WebTerminal from './Terminal';
import Trigger from './Trigger';

export default (): ReactElement => {
  const [isTerminalShown, setIsTerminalShown] = useState(false);
  const toggle = (): void => setIsTerminalShown(isShown => !isShown);

  const memoizedTerminal = useMemo(WebTerminal, []);

  return (
    <>
      <Trigger onClick={toggle} />
      {isTerminalShown && memoizedTerminal}
    </>
  );
};
