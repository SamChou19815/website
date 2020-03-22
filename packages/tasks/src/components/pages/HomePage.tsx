import React, { ReactElement, useState } from 'react';

import Button from '@material-ui/core/Button';

import { firebaseSignOut } from '../../util/authentication';
import useWindowSize from '../hooks/useWindowSize';
import ProjectsPanel from '../includes/ProjectsPanel';
import TasksPanel from '../includes/TasksPanel';
import MaterialThemedNavigableAppContainer from '../util/MaterialThemedNavigableAppContainer';
import styles from './HomePage.module.css';

const SignOutButton = (): ReactElement => (
  <Button color="inherit" onClick={firebaseSignOut}>
    Sign Out
  </Button>
);

export default (): ReactElement => {
  const isDesktop = useWindowSize((size) => size.width >= 1024);
  const [isTasksPanel, setIsTasksPanel] = useState(false);

  if (!isDesktop) {
    const buttons = (
      <>
        <Button color="inherit" onClick={() => setIsTasksPanel((previous) => !previous)}>
          {isTasksPanel ? 'To Projects Mode' : 'To Tasks Mode'}
        </Button>
        <SignOutButton />
      </>
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
      buttons={<SignOutButton />}
    >
      <div className={`${styles.DesktopAllPanels} ${styles.RootContainer} content-below-appbar`}>
        <ProjectsPanel className={styles.ProjectsPanel} />
        <TasksPanel className={styles.TasksPanel} />
      </div>
    </MaterialThemedNavigableAppContainer>
  );
};
