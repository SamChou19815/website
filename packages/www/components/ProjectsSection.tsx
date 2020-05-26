import React, { ReactElement } from 'react';

import classnames from 'classnames';

import projects from '../data/projects';
import CardHeader from './Common/CardHeader';
import ConsoleSection from './Common/ConsoleSection';
import LazyCardMedia from './Common/LazyCardMedia';
import styles from './ProjectsSection.module.css';

import MaterialButtonLink from 'lib-react/MaterialButtonLink';

const ProjectsSection = (): ReactElement => (
  <ConsoleSection id="projects" title="dev-sam projects">
    <div className={styles.ProjectContainer}>
      {projects.map(({ name, type, media, description, links }) => (
        <div key={name} className={classnames('card', styles.ProjectCard)}>
          <LazyCardMedia image={media} title={name} />
          <CardHeader title={name} subheader={type} />
          <div className="card__body">{description}</div>
          <div className="card__footer">
            {links.map(({ text, href }) => (
              <MaterialButtonLink key={text} href={href}>
                {text}
              </MaterialButtonLink>
            ))}
          </div>
        </div>
      ))}
    </div>
  </ConsoleSection>
);

export default ProjectsSection;
