import React, { ReactElement } from 'react';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import Code from '@material-ui/icons/Code';
import Event from '@material-ui/icons/Event';
import Work from '@material-ui/icons/Work';

import { TimelineItem } from '../../data/timeline';
import LazyMaterialMedia from '../Common/LazyMaterialMedia';
import styles from './index.module.css';

import MaterialButtonLink from 'lib-react/MaterialButtonLink';

type Props = { readonly item: TimelineItem };

export default ({ item: { title, type, time, image, detail, links } }: Props): ReactElement => {
  let Icon: (props: SvgIconProps) => ReactElement;
  switch (type) {
    case 'work':
      Icon = Work;
      break;
    case 'project':
      Icon = Code;
      break;
    case 'event':
      Icon = Event;
      break;
    default:
      throw new Error('Unsupported item type!');
  }
  return (
    <div className={styles.CardContainer}>
      <div className={styles.ContentWrapper}>
        <span className={styles.ConnectorDot} />
        <Card className={styles.Card}>
          {image != null && <LazyMaterialMedia image={image} title={title} />}
          <CardHeader avatar={<Icon />} title={title} subheader={time} />
          {detail != null && <CardContent>{detail}</CardContent>}
          {links != null && (
            <CardActions>
              {links.map(
                ({ name, url }, index): ReactElement => (
                  // eslint-disable-next-line react/no-array-index-key
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
