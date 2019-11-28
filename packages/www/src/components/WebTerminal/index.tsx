import React, { ReactElement } from 'react';
import Terminal from 'react-console-emulator';
import commands from './commands';
import styles from './index.module.css';

export default (): ReactElement => (
  <Terminal
    commands={commands}
    welcomeMessage="A terminal for Developer Sam Web OS."
    promptLabel="u@developersam.com:~$"
    className={styles.Terminal}
    contentClassName={styles.TextColor}
    inputAreaClassName={styles.TextColor}
    promptLabelClassName={styles.KeywordColor}
    inputClassName={styles.TextColor}
  />
);
