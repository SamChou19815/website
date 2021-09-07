import React from 'react';

type Props = { readonly title: string; readonly subheader?: string };

export default function CardHeader({ title, subheader }: Props): JSX.Element {
  return (
    <div className="card__header">
      <div className="avatar">
        <div className="avatar__intro">
          <h4 className="avatar__name">{title}</h4>
          {subheader && <small className="avatar__subtitle">{subheader}</small>}
        </div>
      </div>
    </div>
  );
}
