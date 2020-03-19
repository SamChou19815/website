import React, { ReactElement, useState } from 'react';

import Button from '@material-ui/core/Button';

import useWindowSize from '../hooks/useWindowSize';
import ProjectsPanel from '../includes/ProjectsPanel';
import TasksPanel from '../includes/TasksPanel';
import MaterialThemedNavigableAppContainer from '../util/MaterialThemedNavigableAppContainer';
import styles from './HomePage.module.css';

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
      <MaterialThemedNavigableAppContainer
        nestedNavigationLevels={[{ title: isTasksPanel ? 'All Tasks' : 'All Projects' }]}
        buttons={buttons}
      >
        <div className={`${styles.RootContainer} content-below-appbar`}>
          {isTasksPanel ? <TasksPanel /> : <ProjectsPanel />}
        </div>
      </MaterialThemedNavigableAppContainer>
    );
  }

  return (
    <MaterialThemedNavigableAppContainer
      nestedNavigationLevels={[{ title: 'Dashboard', link: '/' }]}
    >
      <div className={`${styles.DesktopAllPanels} ${styles.RootContainer} content-below-appbar`}>
        <ProjectsPanel className={styles.ProjectsPanel} />
        <TasksPanel className={styles.TasksPanel} />
      </div>
    </MaterialThemedNavigableAppContainer>
  );
};
