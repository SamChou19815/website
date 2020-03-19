import React, { ReactElement } from 'react';

import { CircularProgress } from '@material-ui/core';

import styles from './LoadingPage.module.css';

export default (): ReactElement => (
  <div className={styles.LoadingContainer}>
    <CircularProgress />
  </div>
);
