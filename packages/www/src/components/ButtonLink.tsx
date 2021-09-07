import React, { ReactNode } from 'react';

type Props = {
  readonly href: string;
  readonly className?: string;
  readonly children: ReactNode;
};

export default function ButtonLink({ href, children, className }: Props): JSX.Element {
  return (
    <a
      className={className == null ? 'button button--link' : `button button--link ${className}`}
      href={href}
    >
      {typeof children === 'string' ? children.toLocaleUpperCase() : children}
    </a>
  );
}
