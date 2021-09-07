import React from 'react';

type Props = { readonly image: string; readonly title: string };

export default function LazyCardMedia({ image, title }: Props): JSX.Element {
  return (
    <div className="card__image">
      <img src={image} alt={title} title={title} loading="lazy" />
    </div>
  );
}
