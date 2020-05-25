import React, { ReactElement } from 'react';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';

import techTalks from '../data/tech-talks';
import ConsoleSection from './Common/ConsoleSection';
import styles from './TechTalkSection.module.css';

import MaterialButtonLink from 'lib-react/MaterialButtonLink';

export default (): ReactElement => (
  <ConsoleSection id="tech-talks" title="dev-sam tech-talks">
    <div className={styles.TechTalkContainer}>
      {techTalks.map(({ title, type, description, link }) => (
        <Card key={title} className={styles.TechTalkCard}>
          <CardHeader title={title} subheader={type} />
          <CardContent>{description}</CardContent>
          <CardActions>
            <MaterialButtonLink href={link}>Slides</MaterialButtonLink>
          </CardActions>
        </Card>
      ))}
    </div>
  </ConsoleSection>
);
