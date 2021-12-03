import React from 'react';

type Props = { readonly title: string; readonly subheader?: string };

export default function CardHeader({ title, subheader }: Props): JSX.Element {
  return (
    <div className="p-4 pb-0 last:pb-4">
      <h4>{title}</h4>
      {subheader && <small>{subheader}</small>}
    </div>
  );
}
