import React, { ReactElement } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Code from '@material-ui/icons/Code';
import MaterialButtonLink from 'sam-react-common/MaterialButtonLink';
import ConsoleSection from '../Common/ConsoleSection';
import styles from './index.module.css';
import TEN from '../../assets/projects/ten.png';
import SAMLANG from '../../assets/projects/samlang.png';
import Samwise from '../../assets/projects/samwise.png';
import LazyMaterialMedia from '../Common/LazyMaterialMedia';

export default (): ReactElement => (
  <ConsoleSection id="projects" title="./active-projects --pretty-print">
    <div className={styles.ProjectContainer}>
      <Card className={styles.ProjectCard}>
        <LazyMaterialMedia image={SAMLANG} title="SAMLANG" />
        <CardHeader avatar={<Code />} title="SAMLANG" subheader="Programming Language" />
        <CardContent>
          A statically-typed functional programming language with full type inference. A research
          programming language developed by Sam.
        </CardContent>
        <CardActions>
          <MaterialButtonLink href="https://samlang.developersam.com">
            Official Site
          </MaterialButtonLink>
          <MaterialButtonLink href="https://samlang-demo.developersam.com">Demo</MaterialButtonLink>
          <MaterialButtonLink href="https://github.com/SamChou19815/samlang">
            GitHub Repo
          </MaterialButtonLink>
        </CardActions>
      </Card>
      <Card className={styles.ProjectCard}>
        <LazyMaterialMedia image={Samwise} title="Samwise" />
        <CardHeader avatar={<Code />} title="Samwise" subheader="Web App" />
        <CardContent>
          A Student Planner for Everyone. Designed, developed and maintained by&nbsp;
          <a href="https://cornelldti.org">Cornell DTI</a>.
        </CardContent>
        <CardActions>
          <MaterialButtonLink href="https://samwise.today">App</MaterialButtonLink>
          <MaterialButtonLink href="https://github.com/cornell-dti/samwise">
            GitHub Repo
          </MaterialButtonLink>
        </CardActions>
      </Card>
      <Card className={styles.ProjectCard}>
        <LazyMaterialMedia image={TEN} title="TEN" />
        <CardHeader avatar={<Code />} title="TEN" subheader="Game AI" />
        <CardContent>Interesting board game with simple rules. Powered by an MCTS AI.</CardContent>
        <CardActions>
          <MaterialButtonLink href="https://ten.developersam.com">Demo</MaterialButtonLink>
          <MaterialButtonLink href="https://github.com/SamChou19815/ten-golang">
            GitHub Repo
          </MaterialButtonLink>
        </CardActions>
      </Card>
    </div>
  </ConsoleSection>
);
