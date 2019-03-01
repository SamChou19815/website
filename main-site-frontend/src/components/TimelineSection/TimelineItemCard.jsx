// @flow strict
/* eslint-disable react/no-array-index-key */

import type { Node } from 'react';
import React from 'react';
// $FlowFixMe
import Card from '@material-ui/core/Card';
// $FlowFixMe
import CardHeader from '@material-ui/core/CardHeader';
// $FlowFixMe
import CardActions from '@material-ui/core/CardActions';
// $FlowFixMe
import CardContent from '@material-ui/core/CardContent';
// $FlowFixMe
import CardMedia from '@material-ui/core/CardMedia';
// $FlowFixMe
import Icon from '@material-ui/core/Icon';
import type { TimelineItem } from './items';
import styles from './TimelineItemCard.module.css';
import ButtonLink from '../Common/ButtonLink';

type Props = {| +item: TimelineItem |};

export default ({ item: { title, type, time, image, detail, links } }: Props): Node => {
  let iconId: string;
  let subheader: string;
  switch (type) {
    case 'work':
      iconId = 'work';
      subheader = 'Work & Internship';
      break;
    case 'project':
      iconId = 'code';
      subheader = 'Project';
      break;
    case 'event':
      iconId = 'event';
      subheader = 'Life Event';
      break;
    default:
      throw new Error('Unsupported item type!');
  }
  return (
    <div className={styles.Container}>
      <div className={styles.ContentWrapper}>
        <div className={styles.Timestamp}>
          {time}
        </div>
        <span className={styles.ConnectorDot} />
        <Card className={styles.Card}>
          {image != null && <CardMedia image={image} title={title} component="img" />}
          <CardHeader avatar={<Icon>{iconId}</Icon>} title={title} subheader={subheader} />
          {detail != null && <CardContent>{detail}</CardContent>}
          {links != null && (
            <CardActions>
              {links.map(({ name, url }, index) => (
                <ButtonLink key={index} href={url} openInNewTab>{name}</ButtonLink>
              ))}
            </CardActions>
          )}
        </Card>
      </div>
    </div>
  );
};
