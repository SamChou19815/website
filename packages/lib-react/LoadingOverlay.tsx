import React, { ReactElement } from 'react';

import styles from './LoadingOverlay.module.css';

const LoadingOverlay = (): ReactElement => (
  <div className={styles.LoadingOverlay}>
    <div className={styles.LoadingRing}>
      <div />
      <div />
      <div />
      <div />
    </div>
  </div>
);

export default LoadingOverlay;
