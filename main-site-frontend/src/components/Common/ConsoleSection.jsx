// @flow strict

import type { Node } from 'react';
import React from 'react';
import styles from './ConsoleSection.module.css';

type Props = {|
  +id: string;
  +title: string;
  +children: Node;
|};

export default ({ id, title, children }: Props): Node => (
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
