import React, { ReactElement } from 'react';

import DATASET_TIMELINE from '../data/timeline';
import ButtonLink from './Common/ButtonLink';
import CardHeader from './Common/CardHeader';
import LazyCardMedia from './Common/LazyCardMedia';

const TimelineSection = (): ReactElement => (
  <div className="timeline-section">
    <div className="vertical-bar" />
    {DATASET_TIMELINE.map((item) => (
      <div key={`${item.title}-${item.time}`} className="card-container">
        <div className="content-wrapper">
          <span className="connector-dot" />
          <div className="card">
            {item.image != null && <LazyCardMedia image={item.image} title={item.title} />}
            <CardHeader title={item.title} subheader={item.time} />
            {item.detail != null && <div className="card__body">{item.detail}</div>}
            {item.links != null && (
              <div className="card__footer">
                {item.links.map(
                  ({ name, url }, index): ReactElement => (
                    // eslint-disable-next-line react/no-array-index-key
                    <ButtonLink key={index} href={url}>
                      {name}
                    </ButtonLink>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default TimelineSection;
