import React, { ReactElement } from 'react';
import Terminal from 'react-console-emulator';
import commands from './commands';
import styles from './Terminal.module.css';

export default (): ReactElement => (
  <div className={styles.Container}>
    <div className={styles.Title}>Terminal</div>
    <Terminal
      commands={commands}
      welcomeMessage="A terminal for Developer Sam Web OS."
      promptLabel="guest@developersam:~$"
      className={styles.Terminal}
      contentClassName={styles.TextColor}
      inputAreaClassName={styles.TextColor}
      promptLabelClassName={styles.KeywordColor}
      inputClassName={styles.TextColor}
    />
  </div>
);
