import React, { ReactElement, useState } from 'react';
import Button from '@material-ui/core/Button';
import useWindowSize from '../hooks/useWindowSize';
import ProjectsPanel from '../includes/ProjectsPanel';
import TasksPanel from '../includes/TasksPanel';
import styles from './HomePage.module.css';
import MaterialThemedAppContainer from '../util/MaterialThemedAppContainer';

export default (): ReactElement => {
  const isDesktop = useWindowSize(size => size.width >= 968);
  const [isTasksPanel, setIsTasksPanel] = useState(false);

  if (!isDesktop) {
    const buttons = (
      <Button color="inherit" onClick={() => setIsTasksPanel(previous => !previous)}>
        {isTasksPanel ? 'To Projects Mode' : 'To Tasks Mode'}
      </Button>
    );
    return (
      <MaterialThemedAppContainer
        title={isTasksPanel ? 'All Tasks' : 'All Projects'}
        buttons={buttons}
      >
        <div className={styles.RootContainer}>
          {isTasksPanel ? <TasksPanel /> : <ProjectsPanel />}
        </div>
      </MaterialThemedAppContainer>
    );
  }

  return (
    <MaterialThemedAppContainer title="" buttons={null}>
      <div className={`${styles.DesktopAllPanels} ${styles.RootContainer}`}>
        <ProjectsPanel className={styles.ProjectsPanel} />
        <TasksPanel className={styles.TasksPanel} />
      </div>
    </MaterialThemedAppContainer>
  );
};
