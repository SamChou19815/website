import React, { ReactElement } from 'react';

import CardMedia from '@material-ui/core/CardMedia';

type Props = {
  readonly image: string;
  readonly title: string;
};

export default ({ image, title }: Props): ReactElement => (
  <CardMedia image={image} title={title} component="img" loading="lazy" />
);
