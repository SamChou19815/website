import type { ReactNode } from 'react';

const CardContainerBaseCSS = 'flex flex-row flex-wrap justify-center max-w-7xl mx-auto';

type Props = { readonly className?: string; readonly children: ReactNode };

export default function CardContainer({ className, children }: Props): JSX.Element {
  const classes = className != null ? `${CardContainerBaseCSS} ${className}` : CardContainerBaseCSS;
  return <div className={classes}>{children}</div>;
}
