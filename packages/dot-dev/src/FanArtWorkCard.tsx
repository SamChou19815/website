import React, { ReactElement } from 'react';

import type { FanArtWork } from './data';

const FanArtWorkCard = ({
  link,
  author: { authorName, authorWebsite },
  description,
}: FanArtWork): ReactElement => (
  <div className="card">
    <div className="card__image">
      <img src={link} alt={description} title={description} loading="lazy" />
    </div>
    <div className="card__header">
      <h3>{description}</h3>
    </div>
    <div className="card__body">Author: {authorName}</div>
    {authorWebsite && (
      <div className="card__footer">
        <div className="button-group button-group--block">
          <a className="button button--link" href={authorWebsite}>
            {`${authorName}'s website`}
          </a>
        </div>
      </div>
    )}
  </div>
);

export default FanArtWorkCard;
