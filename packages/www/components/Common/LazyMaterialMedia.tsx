import React, { ReactElement } from 'react';

import CardMedia from '@material-ui/core/CardMedia';

type Props = {
  readonly image: string;
  readonly title: string;
};

const LazyMaterialMedia = ({ image, title }: Props): ReactElement => (
  <CardMedia image={image} title={title} component="img" loading="lazy" />
);

export default LazyMaterialMedia;
