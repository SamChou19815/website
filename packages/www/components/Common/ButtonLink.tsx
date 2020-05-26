import React, { ReactElement } from 'react';

import classnames from 'classnames';

type Props = {
  readonly href: string;
  readonly className?: string;
  readonly children: string;
};

const ButtonLink = ({ href, children, className }: Props): ReactElement => (
  <a className={classnames('button', 'button--link', className)} href={href}>
    {children.toLocaleUpperCase()}
  </a>
);

export default ButtonLink;
