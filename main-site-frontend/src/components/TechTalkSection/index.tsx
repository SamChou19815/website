import React, { ReactElement } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Icon from '@material-ui/core/Icon';
import styles from './index.module.css';
import ButtonLink from '../Common/ButtonLink';
import ConsoleSection from '../Common/ConsoleSection';

const schoolIcon = <Icon>school</Icon>;

export default (): ReactElement => (
  <ConsoleSection id="tech-talks" title="./tech-talks -all">
    <div className={styles.TechTalkContainer}>
      <Card className={styles.TechTalkCard}>
        <CardHeader avatar={schoolIcon} title="How to scale" subheader="Learning Series" />
        <CardContent>
          {'Tips on scaling your codebase and your workload,'}
          {" with lessons learned from Samwise's codebase."}
        </CardContent>
        <CardActions>
          <ButtonLink href="/how-to-scale.pdf" openInNewTab>
            Slides
          </ButtonLink>
        </CardActions>
      </Card>
      <Card className={styles.TechTalkCard}>
        <CardHeader avatar={schoolIcon} title="Intro to Firebase" subheader="DevSesh" />
        <CardContent>
          Tech stack discussion on Firebase, and why Samwise switched to Firebase.
        </CardContent>
        <CardActions>
          <ButtonLink href="/intro-to-firebase.pdf" openInNewTab>
            Slides
          </ButtonLink>
          <ButtonLink href="https://jessicahong9.github.io/" openInNewTab>
            {"Co-speaker Jessica's website"}
          </ButtonLink>
        </CardActions>
      </Card>
    </div>
  </ConsoleSection>
);
