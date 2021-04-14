import React, { ReactElement } from 'react';

import DATASET_TECH_TALKS from '../data/tech-talks';
import CardHeader from './Common/CardHeader';

const TechTalkSection = (): ReactElement => (
  <div className="card-container">
    {DATASET_TECH_TALKS.map(({ title, description, link }) => (
      <div key={title} className="card responsive-card">
        <CardHeader title={title} />
        <div className="card__body">{description}</div>
        <div className="card__footer">
          <a href={link} className="button button--link">
            SLIDES
          </a>
        </div>
      </div>
    ))}
  </div>
);

export default TechTalkSection;
