import React, { ReactElement, useState } from 'react';

import Button from '@material-ui/core/Button';

import { firebaseSignOut } from '../../util/authentication';
import useWindowSize from '../hooks/useWindowSize';
import ProjectsPanel from '../includes/ProjectsPanel';
import TasksPanel from '../includes/TasksPanel';
import ConfiguredMainAppBarrier from '../util/ConfiguredMainAppBarrier';
import MaterialThemedNavigableAppContainer from '../util/MaterialThemedNavigableAppContainer';
import styles from './HomePage.module.css';

const SignOutButton = (): ReactElement => (
  <Button color="inherit" onClick={firebaseSignOut}>
    Sign Out
  </Button>
);

const MobileHomePage = (): ReactElement => {
  const [isTasksPanel, setIsTasksPanel] = useState(false);

  const buttons = (
    <>
      <Button color="inherit" onClick={() => setIsTasksPanel((previous) => !previous)}>
        {isTasksPanel ? 'To Projects Mode' : 'To Tasks Mode'}
      </Button>
      <SignOutButton />
    </>
  );
  return (
    <MaterialThemedNavigableAppContainer buttons={buttons}>
      <div className={`${styles.RootContainer} content-below-appbar`}>
        {isTasksPanel ? <TasksPanel /> : <ProjectsPanel />}
      </div>
    </MaterialThemedNavigableAppContainer>
  );
};

const DesktopHomePage = (): ReactElement => (
  <MaterialThemedNavigableAppContainer buttons={<SignOutButton />}>
    <div className={`${styles.DesktopAllPanels} ${styles.RootContainer} content-below-appbar`}>
      <ProjectsPanel className={styles.ProjectsPanel} />
      <TasksPanel className={styles.TasksPanel} />
    </div>
  </MaterialThemedNavigableAppContainer>
);

const HomePage = (): ReactElement => {
  const isDesktop = useWindowSize((size) => size.width >= 1024);
  return isDesktop ? <DesktopHomePage /> : <MobileHomePage />;
};

export default (): ReactElement => <ConfiguredMainAppBarrier appComponent={HomePage} />;
