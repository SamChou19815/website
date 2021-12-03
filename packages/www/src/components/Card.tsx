import React, { ReactNode } from 'react';

const CardBaseCSS = 'flex flex-col bg-white dark:bg-gray-800 rounded filter drop-shadow';

type Props = { readonly className?: string; readonly children: ReactNode };

export default function Card({ className, children }: Props): JSX.Element {
  const classes = className != null ? `${CardBaseCSS} ${className}` : CardBaseCSS;
  return <div className={classes}>{children}</div>;
}
