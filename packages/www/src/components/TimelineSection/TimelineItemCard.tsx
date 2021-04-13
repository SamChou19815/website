import React, { ReactElement } from 'react';

import type { TimelineItem } from '../../data/timeline';
import ButtonLink from '../Common/ButtonLink';
import CardHeader from '../Common/CardHeader';
import LazyCardMedia from '../Common/LazyCardMedia';

type Props = { readonly item: TimelineItem };

const TimelineItemCard = ({ item: { title, time, image, detail, links } }: Props): ReactElement => {
  return (
    <div className="timeline-section-card-container">
      <div className="timeline-section-content-wrapper">
        <span className="timeline-section-connector-dot" />
        <div className="card timeline-section-card">
          {image != null && <LazyCardMedia image={image} title={title} />}
          <CardHeader title={title} subheader={time} />
          {detail != null && <div className="card__body">{detail}</div>}
          {links != null && (
            <div className="card__footer">
              {links.map(
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
  );
};

export default TimelineItemCard;
