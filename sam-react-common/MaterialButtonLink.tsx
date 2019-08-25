import React, { ReactElement, ReactNode } from 'react';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';

type Props = {
  readonly href: string;
  readonly children: ReactNode;
  readonly color: 'primary' | 'secondary' | 'inherit';
  readonly openInNewTab: boolean;
  readonly onClick?: () => void;
  readonly className?: string;
};

const MaterialButtonLink = ({
  href,
  children,
  color,
  openInNewTab,
  onClick,
  className
}: Props): ReactElement => (
  <Button color={color} className={className} onClick={onClick}>
    <Link
      color={color}
      href={href === '' ? undefined : href}
      target={openInNewTab ? '_blank' : undefined}
      rel="noopener noreferrer"
    >
      {children}
    </Link>
  </Button>
);

MaterialButtonLink.defaultProps = {
  color: 'primary',
  openInNewTab: false
};

export default MaterialButtonLink;
