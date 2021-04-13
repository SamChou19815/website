import React, { ReactElement } from 'react';

type Props = { readonly title: string; readonly subheader?: string };

const CardHeader = ({ title, subheader }: Props): ReactElement => {
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
};

export default CardHeader;
