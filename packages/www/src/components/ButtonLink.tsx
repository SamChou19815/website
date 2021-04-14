import React, { ReactElement, ReactNode } from 'react';

type Props = {
  readonly href: string;
  readonly className?: string;
  readonly children: ReactNode;
};

const ButtonLink = ({ href, children, className }: Props): ReactElement => (
  <a
    className={className == null ? 'button button--link' : `button button--link ${className}`}
    href={href}
  >
    {typeof children === 'string' ? children.toLocaleUpperCase() : children}
  </a>
);

export default ButtonLink;
