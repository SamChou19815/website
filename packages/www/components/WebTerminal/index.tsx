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

export default (): ReactElement => {
  const [isTerminalShown, setIsTerminalShown] = useState(false);
  const toggle = (): void => setIsTerminalShown((isShown) => !isShown);

  return <WebTerminal shown={isTerminalShown} onTrigger={toggle} />;
};
