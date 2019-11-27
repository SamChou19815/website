import React, { ReactElement, ReactNode } from 'react';
import styles from './ConsoleSection.module.css';

type Props = {
  readonly id: string;
  readonly title: string;
  readonly children: ReactNode;
};

export default ({ id, title, children }: Props): ReactElement => (
  <section id={id} className={styles.Section}>
    <h3 className={styles.Title}>
      <code>
        {'> '}
        {title}
      </code>
    </h3>
    {children}
  </section>
);
