import React, { ReactElement } from 'react';

import styles from './Trigger.module.css';

type Props = { readonly onClick: () => void };

const Trigger = ({ onClick }: Props): ReactElement => (
  <button type="button" onClick={onClick} className={styles.TriggerButton}>
    <span className={styles.FirstEdge} />
    <span className={styles.SecondEdge} />
    <span className={styles.Text}>Terminal Toggle</span>
  </button>
);

export default Trigger;
