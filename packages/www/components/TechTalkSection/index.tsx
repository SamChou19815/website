import React, { ReactElement } from 'react';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';

import ConsoleSection from '../Common/ConsoleSection';
import styles from './index.module.css';

import MaterialButtonLink from 'lib-react/MaterialButtonLink';

export default (): ReactElement => (
  <ConsoleSection id="tech-talks" title="tech-talks --all">
    <div className={styles.TechTalkContainer}>
      <Card className={styles.TechTalkCard}>
        <CardHeader title="How to scale" subheader="Learning Series" />
        <CardContent>
          Tips on scaling your codebase and your workload, with lessons learned from Samwise&apos;s
          codebase.
        </CardContent>
        <CardActions>
          <MaterialButtonLink href="/how-to-scale.pdf">Slides</MaterialButtonLink>
        </CardActions>
      </Card>
      <Card className={styles.TechTalkCard}>
        <CardHeader title="Intro to Firebase" subheader="DevSesh" />
        <CardContent>
          Tech stack discussion on Firebase, and why Samwise switched to Firebase.
        </CardContent>
        <CardActions>
          <MaterialButtonLink href="/intro-to-firebase.pdf">Slides</MaterialButtonLink>
          <MaterialButtonLink href="https://jessicahong9.github.io/">
            Co-speaker&apos;s website
          </MaterialButtonLink>
        </CardActions>
      </Card>
      <Card className={styles.TechTalkCard}>
        <CardHeader title="Build your programming language" subheader="DevSesh" />
        <CardContent>
          A tutorial of making a simple programming language derived from lambda-calculus.
        </CardContent>
        <CardActions>
          <MaterialButtonLink href="/build-your-own-programming-language.pdf">
            Slides
          </MaterialButtonLink>
        </CardActions>
      </Card>
      <Card className={styles.TechTalkCard}>
        <CardHeader title="Build a (simplified) React" subheader="DevSesh" />
        <CardContent>
          A tutorial of making a simplified React runtime with support for useState and useEffect
          hooks.
        </CardContent>
        <CardActions>
          <MaterialButtonLink href="/build-simplified-react.pdf">Slides</MaterialButtonLink>
        </CardActions>
      </Card>
    </div>
  </ConsoleSection>
);
