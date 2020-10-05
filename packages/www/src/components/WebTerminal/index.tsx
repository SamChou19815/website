import React, { ReactElement, useState } from 'react';

import Terminal from './Terminal';
import Trigger from './Trigger';

const memoizedTerminal = <Terminal />;

type Props = {
  readonly shown: boolean;
  readonly onTrigger: () => void;
};

export const WebTerminal = ({ shown, onTrigger }: Props): ReactElement => (
  <>
    <Trigger onClick={onTrigger} />
    {shown && memoizedTerminal}
  </>
);

const HiddenByDefaultWebTerminal = (): ReactElement => {
  const [isTerminalShown, setIsTerminalShown] = useState(false);
  const toggle = (): void => setIsTerminalShown((isShown) => !isShown);

  return <WebTerminal shown={isTerminalShown} onTrigger={toggle} />;
};

export default HiddenByDefaultWebTerminal;
