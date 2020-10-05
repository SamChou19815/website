import React, { ReactElement } from 'react';

import clsx from 'clsx';

import DATASET_PROJECTS from '../data/projects';
import ButtonLink from './Common/ButtonLink';
import CardHeader from './Common/CardHeader';
import ConsoleSection from './Common/ConsoleSection';
import LazyCardMedia from './Common/LazyCardMedia';
import styles from './ProjectsSection.module.css';

const ProjectsSection = (): ReactElement => (
  <ConsoleSection id="projects" title="dev-sam projects">
    <div className={styles.ProjectContainer}>
      {DATASET_PROJECTS.map(({ name, type, media, description, links }) => (
        <div key={name} className={clsx('card', styles.ProjectCard)}>
          <LazyCardMedia image={media} title={name} />
          <CardHeader title={name} subheader={type} />
          <div className="card__body">{description}</div>
          <div className="card__footer">
            <div className="button-group button-group--block">
              {links.map(({ text, href }) => (
                <ButtonLink key={text} href={href}>
                  {text}
                </ButtonLink>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </ConsoleSection>
);

export default ProjectsSection;
