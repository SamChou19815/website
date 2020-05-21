import React, { ReactElement } from 'react';

import Button from '@material-ui/core/Button';
import { firebaseSignOut } from 'lib-firebase/authentication';

import TasksPanel from '../includes/TasksPanel';
import ConfiguredMainAppBarrier from '../util/ConfiguredMainAppBarrier';
import MaterialThemedNavigableAppContainer from '../util/MaterialThemedNavigableAppContainer';
import styles from './HomePage.module.css';

const SignOutButton = (): ReactElement => (
  <Button color="inherit" onClick={firebaseSignOut}>
    Sign Out
  </Button>
);

const HomePage = (): ReactElement => (
  <MaterialThemedNavigableAppContainer buttons={<SignOutButton />}>
    <div className={`${styles.RootContainer} content-below-appbar`}>
      <TasksPanel />
    </div>
  </MaterialThemedNavigableAppContainer>
);

export default (): ReactElement => <ConfiguredMainAppBarrier appComponent={HomePage} />;
