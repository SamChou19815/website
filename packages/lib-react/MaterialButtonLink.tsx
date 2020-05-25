import React, { ReactElement, ReactNode } from 'react';

import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';

type Props = {
  readonly href: string;
  readonly children: ReactNode;
  readonly color?: 'primary' | 'secondary' | 'inherit';
  readonly onClick?: () => void;
  readonly className?: string;
  readonly linkClassName?: string;
};

const MaterialButtonLink = ({
  href,
  children,
  color = 'primary',
  onClick,
  className,
  linkClassName,
}: Props): ReactElement => (
  <Button color={color} className={className} onClick={onClick}>
    <Link color={color} href={href === '' ? undefined : href} className={linkClassName}>
      {children}
    </Link>
  </Button>
);

export default MaterialButtonLink;
