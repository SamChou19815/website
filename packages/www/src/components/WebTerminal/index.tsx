import React, { ReactElement, useState } from 'react';
import WebTerminal from './Terminal';
import Trigger from './Trigger';

const memoizedTerminal = <WebTerminal />;

export default (): ReactElement => {
  const [isTerminalShown, setIsTerminalShown] = useState(false);
  const toggle = (): void => setIsTerminalShown(isShown => !isShown);

  return (
    <>
      <Trigger onClick={toggle} />
      {isTerminalShown && memoizedTerminal}
    </>
  );
};
