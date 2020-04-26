import React, { ReactElement } from 'react';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import Code from '@material-ui/icons/Code';
import MaterialButtonLink from 'lib-react/MaterialButtonLink';

import Docusaurus from '../../assets/projects/docusaurus.png';
import MiniReact from '../../assets/projects/mini-react.png';
import SAMLANG from '../../assets/projects/samlang.png';
import Samwise from '../../assets/projects/samwise.png';
import Tasks from '../../assets/projects/tasks.png';
import TEN from '../../assets/projects/ten.png';
import ConsoleSection from '../Common/ConsoleSection';
import LazyMaterialMedia from '../Common/LazyMaterialMedia';
import styles from './index.module.css';

export default (): ReactElement => (
  <ConsoleSection id="projects" title="projects --active">
    <div className={styles.ProjectContainer}>
      <Card className={styles.ProjectCard}>
        <LazyMaterialMedia image={SAMLANG} title="SAMLANG" />
        <Divider />
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
        <LazyMaterialMedia image={Docusaurus} title="Docusaurus" />
        <Divider />
        <CardHeader avatar={<Code />} title="Docusaurus" subheader="Open source contributions" />
        <CardContent>
          A static documentation site generator developed by Facebook open source. I am one of the
          top 20 contributors.
        </CardContent>
        <CardActions>
          <MaterialButtonLink href="https://v2.docusaurus.io">Official Site</MaterialButtonLink>
          <MaterialButtonLink href="https://github.com/facebook/docusaurus">
            GitHub Repo
          </MaterialButtonLink>
        </CardActions>
      </Card>
      <Card className={styles.ProjectCard}>
        <LazyMaterialMedia image={MiniReact} title="mini-react" />
        <Divider />
        <CardHeader avatar={<Code />} title="mini-react" subheader="Framework" />
        <CardContent>
          A simplified version of React runtime created from scratch. It has support for the{' '}
          <code>useState</code> hook and <code>useEffect</code> hook.
        </CardContent>
        <CardActions>
          <MaterialButtonLink href="https://mini-react.developersam.com">
            Demo Site
          </MaterialButtonLink>
          <MaterialButtonLink href="https://github.com/SamChou19815/mini-react">
            GitHub Repo
          </MaterialButtonLink>
          <MaterialButtonLink href="/build-simplified-react.pdf">Slides</MaterialButtonLink>
        </CardActions>
      </Card>
      <Card className={styles.ProjectCard}>
        <LazyMaterialMedia image={Samwise} title="Samwise" />
        <Divider />
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
        <LazyMaterialMedia image={Tasks} title="Tasks" />
        <Divider />
        <CardHeader avatar={<Code />} title="Tasks" subheader="Web App" />
        <CardContent>A planner with drag and drop and dependency analysis.</CardContent>
        <CardActions>
          <MaterialButtonLink href="https://tasks.developersam.com">App</MaterialButtonLink>
        </CardActions>
      </Card>
      <Card className={styles.ProjectCard}>
        <LazyMaterialMedia image={TEN} title="TEN" />
        <Divider />
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
