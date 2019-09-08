import React, { ReactElement } from 'react';
import CardMedia from '@material-ui/core/CardMedia';

type Props = {
  readonly image: string;
  readonly title: string;
};

export default ({ image, title }: Props): ReactElement => (
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  <CardMedia image={image} title={title} component="img" loading="lazy" />
);
