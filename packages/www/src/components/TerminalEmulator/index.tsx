import React, { ReactElement } from 'react';
import Terminal from 'react-console-emulator';
import commands from './commands';
import styles from './TerminalEmulator.module.css';

export default (): ReactElement => (
  <Terminal
    commands={commands}
    welcomeMessage="A terminal for Developer Sam Web OS."
    promptLabel="you@developersam.com:~$"
    className={styles.Terminal}
    contentClassName={styles.TextColor}
    inputAreaClassName={styles.TextColor}
    promptLabelClassName={styles.TextColor}
    inputClassName={styles.TextColor}
  />
);
