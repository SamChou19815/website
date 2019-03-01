// @flow strict

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
import ConsoleSection from './ConsoleSection';
import styles from './ProjectsSection.module.css';
import ButtonLink from './ButtonLink';
import TEN from '../assets/projects/ten.png';
import SAMLANG from '../assets/projects/samlang.png';
import Samwise from '../assets/projects/samwise.png';

export default (): Node => (
  <ConsoleSection id="projects" title="active-projects --pretty">
    <div className={styles.ProjectContainer}>
      <Card className={styles.ProjectCard}>
        <CardMedia image={SAMLANG} title="SAMLANG" component="img" />
        <CardHeader avatar={<Icon>code</Icon>} title="SAMLANG" subheader="Programming Language" />
        <CardContent>
          A statically-typed functional programming language with full type inference.
          A research programming language developed by Sam.
        </CardContent>
        <CardActions>
          <ButtonLink href="https://samlang.developersam.com" openInNewTab>
            Official Site
          </ButtonLink>
          <ButtonLink href="https://samlang-demo.developersam.com" openInNewTab>
            Demo
          </ButtonLink>
          <ButtonLink href="https://github.com/SamChou19815/samlang" openInNewTab>
            GitHub Repo
          </ButtonLink>
        </CardActions>
      </Card>
      <Card className={styles.ProjectCard}>
        <CardMedia image={Samwise} title="Samwise" component="img" />
        <CardHeader avatar={<Icon>code</Icon>} title="Samwise" subheader="Web App" />
        <CardContent>
          {'A Student Planner for Everyone. Designed, developed and maintained by '}
          <a href="https://cornelldti.org" target="_blank" rel="noopener noreferrer">Cornell DTI</a>
          .
        </CardContent>
        <CardActions>
          <ButtonLink href="https://github.com/cornell-dti/samwise" openInNewTab>
            GitHub Repo
          </ButtonLink>
        </CardActions>
      </Card>
      <Card className={styles.ProjectCard}>
        <CardMedia image={TEN} title="TEN" component="img" />
        <CardHeader avatar={<Icon>code</Icon>} title="TEN" subheader="Game AI" />
        <CardContent>
          Interesting board game with simple rules.
          Powered by an MCTS AI.
        </CardContent>
        <CardActions>
          <ButtonLink href="https://ten.developersam.com" openInNewTab>Demo</ButtonLink>
          <ButtonLink href="https://github.com/SamChou19815/ten" openInNewTab>
            GitHub Repo
          </ButtonLink>
        </CardActions>
      </Card>
    </div>
  </ConsoleSection>
);
