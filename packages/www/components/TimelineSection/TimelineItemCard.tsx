import React, { ReactElement } from 'react';

import classnames from 'classnames';

import { TimelineItem } from '../../data/timeline';
import CardHeader from '../Common/CardHeader';
import LazyCardMedia from '../Common/LazyCardMedia';
import styles from './index.module.css';

import MaterialButtonLink from 'lib-react/MaterialButtonLink';

type Props = { readonly item: TimelineItem };

const TimelineItemCard = ({ item: { title, time, image, detail, links } }: Props): ReactElement => {
  return (
    <div className={styles.CardContainer}>
      <div className={styles.ContentWrapper}>
        <span className={styles.ConnectorDot} />
        <div className={classnames('card', styles.Card)}>
          {image != null && <LazyCardMedia image={image} title={title} />}
          <CardHeader title={title} subheader={time} />
          {detail != null && <div className="card__body">{detail}</div>}
          {links != null && (
            <div className="card__footer">
              {links.map(
                ({ name, url }, index): ReactElement => (
                  // eslint-disable-next-line react/no-array-index-key
                  <MaterialButtonLink key={index} href={url}>
                    {name}
                  </MaterialButtonLink>
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
