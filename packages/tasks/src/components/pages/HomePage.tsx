import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { ReduxStoreState, ReduxStoreProject } from '../../models/redux-store-types';
import styles from './HomePage.module.css';
import ProjectCard from '../includes/ProjectCard';

export default (): ReactElement => {
  const projects = useSelector<ReduxStoreState, readonly ReduxStoreProject[]>(
    state => state.projects
  );

  return (
    <div>
      <section className={styles.CardContainer}>
        {projects.map(project => (
          <ProjectCard key={project.projectId} project={project} />
        ))}
      </section>
    </div>
  );
};
