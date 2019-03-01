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
  +className?: string;
|};

export default ({ href, children, className }: Props): Node => (
  <Button color="inherit" className={className}>
    <Link color="inherit" href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </Link>
  </Button>
);
