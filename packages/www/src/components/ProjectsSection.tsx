import clsx from 'clsx';
import type { ReactElement } from 'react';

import DATASET_PROJECTS from '../data/projects';
import ButtonLink from './Common/ButtonLink';
import CardHeader from './Common/CardHeader';
import LazyCardMedia from './Common/LazyCardMedia';
import styles from './ProjectsSection.module.css';

const ProjectsSection = (): ReactElement => (
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
);

export default ProjectsSection;
