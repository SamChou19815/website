/* eslint-disable react/no-array-index-key */

import React, { ReactElement } from 'react';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import Code from '@material-ui/icons/Code';
import Event from '@material-ui/icons/Event';
import Work from '@material-ui/icons/Work';
import MaterialButtonLink from 'lib-react/MaterialButtonLink';

import LazyMaterialMedia from '../Common/LazyMaterialMedia';
import styles from './TimelineItemCard.module.css';
import { TimelineItem } from './items';

type Props = { readonly item: TimelineItem };

export default ({ item: { title, type, time, image, detail, links } }: Props): ReactElement => {
  let Icon: (props: SvgIconProps) => ReactElement;
  let subheader: string;
  switch (type) {
    case 'work':
      Icon = Work;
      subheader = 'Work & Internship';
      break;
    case 'project':
      Icon = Code;
      subheader = 'Project';
      break;
    case 'event':
      Icon = Event;
      subheader = 'Life Event';
      break;
    default:
      throw new Error('Unsupported item type!');
  }
  return (
    <div className={styles.Container}>
      <div className={styles.ContentWrapper}>
        <div className={styles.Timestamp}>{time}</div>
        <span className={styles.ConnectorDot} />
        <Card className={styles.Card}>
          {image != null && <LazyMaterialMedia image={image} title={title} />}
          <CardHeader avatar={<Icon />} title={title} subheader={subheader} />
          {detail != null && <CardContent>{detail}</CardContent>}
          {links != null && (
            <CardActions>
              {links.map(
                ({ name, url }, index): ReactElement => (
                  <MaterialButtonLink key={index} href={url}>
                    {name}
                  </MaterialButtonLink>
                )
              )}
            </CardActions>
          )}
        </Card>
      </div>
    </div>
  );
};
