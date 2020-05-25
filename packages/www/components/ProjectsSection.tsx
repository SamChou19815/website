import React, { ReactElement } from 'react';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';

import projects from '../data/projects';
import ConsoleSection from './Common/ConsoleSection';
import LazyMaterialMedia from './Common/LazyMaterialMedia';
import styles from './ProjectsSection.module.css';

import MaterialButtonLink from 'lib-react/MaterialButtonLink';

const ProjectsSection = (): ReactElement => (
  <ConsoleSection id="projects" title="dev-sam projects">
    <div className={styles.ProjectContainer}>
      {projects.map(({ name, type, media, description, links }) => (
        <Card key={name} className={styles.ProjectCard}>
          <LazyMaterialMedia image={media} title={name} />
          <Divider />
          <CardHeader title={name} subheader={type} />
          <CardContent>{description}</CardContent>
          <CardActions>
            {links.map(({ text, href }) => (
              <MaterialButtonLink key={text} href={href}>
                {text}
              </MaterialButtonLink>
            ))}
          </CardActions>
        </Card>
      ))}
    </div>
  </ConsoleSection>
);

export default ProjectsSection;
