import React, { ReactElement, ReactNode } from 'react';

import styles from './ConsoleSection.module.css';

type Props = {
  readonly id: string;
  readonly title: string;
  readonly className?: string;
  readonly titleClassName?: string;
  readonly children: ReactNode;
};

const classes = (firstClass: string, secondClass?: string): string =>
  secondClass === undefined ? firstClass : `${firstClass} ${secondClass}`;

export default ({ id, title, className, titleClassName, children }: Props): ReactElement => (
  <section id={id} className={classes(styles.Section, className)}>
    <h3 className={classes(styles.Title, titleClassName)}>
      <code>
        $&nbsp;
        {title}
      </code>
    </h3>
    {children}
  </section>
);
