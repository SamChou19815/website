import clsx from 'clsx';
import React, { ReactElement, ReactNode } from 'react';

type Props = {
  readonly href: string;
  readonly className?: string;
  readonly children: ReactNode;
};

const ButtonLink = ({ href, children, className }: Props): ReactElement => (
  <a className={clsx('button', 'button--link', className)} href={href}>
    {typeof children === 'string' ? children.toLocaleUpperCase() : children}
  </a>
);

export default ButtonLink;
