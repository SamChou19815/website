import React, { ReactElement } from 'react';
import Terminal from 'react-console-emulator';
import commands from './commands';
import styles from './Terminal.module.css';

export default (): ReactElement => (
  <div className={styles.Container}>
    <div className={styles.Title}>Terminal</div>
    <Terminal
      commands={commands}
      welcomeMessage="Developer Sam Web Terminal. Type `help` for a list of available commands."
      promptLabel="guest@developersam:~$"
      className={styles.Terminal}
      contentClassName={styles.TextColor}
      inputAreaClassName={styles.TextColor}
      promptLabelClassName={styles.KeywordColor}
      inputClassName={styles.TextColor}
    />
  </div>
);
