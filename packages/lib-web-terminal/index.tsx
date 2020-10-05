import React, { ReactElement, useState } from 'react';

import StatefulTerminal from './StatefulTerminal';
import styles from './index.module.css';

const memoizedTerminal = <StatefulTerminal />;

const HiddenByDefaultWebTerminal = (): ReactElement => {
  const [isTerminalShown, setIsTerminalShown] = useState(false);
  const toggle = (): void => setIsTerminalShown((isShown) => !isShown);

  return (
    <>
      <button type="button" onClick={toggle} className={styles.TriggerButton}>
        <span className={styles.FirstEdge} />
        <span className={styles.SecondEdge} />
        <span className={styles.Text}>Terminal Toggle</span>
      </button>
      {isTerminalShown && memoizedTerminal}
    </>
  );
};

export default HiddenByDefaultWebTerminal;
