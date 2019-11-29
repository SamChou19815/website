import React, { ReactElement } from 'react';
import BaseTerminal from './BaseTerminal';
import commands from './commands';
import styles from './Terminal.module.css';

export default (): ReactElement => (
  <div className={styles.TerminalContainer}>
    <div className={styles.TerminalTitle}>Terminal</div>
    <BaseTerminal commands={commands} />
  </div>
);
