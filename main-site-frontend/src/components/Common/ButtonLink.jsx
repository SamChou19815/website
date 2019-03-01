// @flow strict

import type { Node } from 'react';
import React from 'react';
// $FlowFixMe
import Button from '@material-ui/core/Button';
// $FlowFixMe
import Link from '@material-ui/core/Link';

type Props = {|
  +href: string;
  +children: Node;
  +color: string;
  +openInNewTab: boolean;
  +onClick?: () => void;
  +className?: string;
|};

const ButtonLink = ({ href, children, color, openInNewTab, onClick, className }: Props): Node => (
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

ButtonLink.defaultProps = {
  color: 'primary',
  openInNewTab: false,
};

export default ButtonLink;
