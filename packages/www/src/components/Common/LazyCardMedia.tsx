import type { ReactElement } from 'react';

type Props = {
  readonly image: string;
  readonly title: string;
};

const LazyCardMedia = ({ image, title }: Props): ReactElement => (
  <div className="card__image">
    <img src={image} alt={title} title={title} loading="lazy" />
  </div>
);

export default LazyCardMedia;
