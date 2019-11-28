import React, { ReactElement } from 'react';
import styles from './Trigger.module.css';

type Props = { readonly onClick: () => void };

export default ({ onClick }: Props): ReactElement => (
  <button type="button" onClick={onClick} className={styles.TriggerButton}>
    <span className={styles.FirstEdge} />
    <span className={styles.SecondEdge} />
  </button>
);
