import React, { ReactElement, useState } from 'react';
import useWindowSize from '../hooks/useWindowSize';
import ProjectsPanel from '../includes/ProjectsPanel';
import TasksPanel from '../includes/TasksPanel';
import styles from './HomePage.module.css';

export default (): ReactElement => {
  const isDesktop = useWindowSize(size => size.width >= 968);
  const [isTasksPanel, setIsTasksPanel] = useState(false);

  if (!isDesktop) {
    return (
      <div className={styles.RootContainer}>
        <button type="button" onClick={() => setIsTasksPanel(previous => !previous)}>
          Toggle
        </button>
        {isTasksPanel ? <TasksPanel /> : <ProjectsPanel />}
      </div>
    );
  }

  return (
    <div className={`${styles.DesktopAllPanels} ${styles.RootContainer}`}>
      <ProjectsPanel className={styles.ProjectsPanel} />
      <TasksPanel className={styles.TasksPanel} />
    </div>
  );
};
