/* eslint-disable react/no-array-index-key */

import React, { ReactElement } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Icon from '@material-ui/core/Icon';
import { TimelineItem } from './items';
import styles from './TimelineItemCard.module.css';
import ButtonLink from '../Common/ButtonLink';

type Props = { readonly item: TimelineItem };

export default ({ item: { title, type, time, image, detail, links } }: Props): ReactElement => {
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
              {links.map(({ name, url }, index): ReactElement => (
                <ButtonLink key={index} href={url} openInNewTab>{name}</ButtonLink>
              ))}
            </CardActions>
          )}
        </Card>
      </div>
    </div>
  );
};
