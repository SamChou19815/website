import React, { ReactElement } from 'react';

import styles from './LoadingOverlay.module.css';

const LoadingOverlay = (): ReactElement => (
  <div className={`simple-page-center ${styles.LoadingOverlay}`}>
    <div className={styles.LoadingRing}>
      <div />
      <div />
      <div />
      <div />
    </div>
  </div>
);

export default LoadingOverlay;
