import React, { ReactElement } from 'react';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import School from '@material-ui/icons/School';
import MaterialButtonLink from 'lib-react/MaterialButtonLink';

import ConsoleSection from '../Common/ConsoleSection';
import styles from './index.module.css';

const schoolIcon = <School />;

export default (): ReactElement => (
  <ConsoleSection id="tech-talks" title="tech-talks --all">
    <div className={styles.TechTalkContainer}>
      <Card className={styles.TechTalkCard}>
        <CardHeader avatar={schoolIcon} title="How to scale" subheader="Learning Series" />
        <CardContent>
          Tips on scaling your codebase and your workload, with lessons learned from Samwise&apos;s
          codebase.
        </CardContent>
        <CardActions>
          <MaterialButtonLink href="/how-to-scale.pdf">Slides</MaterialButtonLink>
        </CardActions>
      </Card>
      <Card className={styles.TechTalkCard}>
        <CardHeader avatar={schoolIcon} title="Intro to Firebase" subheader="DevSesh" />
        <CardContent>
          Tech stack discussion on Firebase, and why Samwise switched to Firebase.
        </CardContent>
        <CardActions>
          <MaterialButtonLink href="/intro-to-firebase.pdf">Slides</MaterialButtonLink>
          <MaterialButtonLink href="https://jessicahong9.github.io/">
            Co-speaker Jessica&apos;s website
          </MaterialButtonLink>
        </CardActions>
      </Card>
      <Card className={styles.TechTalkCard}>
        <CardHeader
          avatar={schoolIcon}
          title="How to build your own programming language"
          subheader="DevSesh"
        />
        <CardContent>
          A tutorial of making a simple programming language derived from lambda-calculus.
        </CardContent>
        <CardActions>
          <MaterialButtonLink href="/build-your-own-programming-language.pdf">
            Slides
          </MaterialButtonLink>
        </CardActions>
      </Card>
    </div>
  </ConsoleSection>
);
