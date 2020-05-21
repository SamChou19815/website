import React, { ReactElement } from 'react';

import Button from '@material-ui/core/Button';
import Head from 'next/head';
import { Provider as ReactReduxProvider } from 'react-redux';

import { store } from '../models/redux-store';
import { APP_NAME } from '../util/constants';
import styles from './App.module.css';
import TasksPanel from './includes/TasksPanel';
import ConfiguredMainAppBarrier from './util/ConfiguredMainAppBarrier';

import { firebaseSignOut } from 'lib-firebase/authentication';
import MaterialThemedApp from 'lib-react/MaterialThemedApp';

const SignOutButton = (): ReactElement => (
  <Button color="inherit" onClick={firebaseSignOut}>
    Sign Out
  </Button>
);

const HomePage = (): ReactElement => (
  <MaterialThemedApp
    title={APP_NAME}
    appBarPosition="fixed"
    styles={{ app: styles.App, title: styles.Title }}
    buttons={<SignOutButton />}
  >
    <div className={`${styles.RootContainer} content-below-appbar`}>
      <TasksPanel />
    </div>
  </MaterialThemedApp>
);

export default (): ReactElement => (
  <ReactReduxProvider store={store}>
    <Head>
      <meta charSet="utf-8" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="theme-color" content="#F7F7F7" />
      <link rel="manifest" href="/manifest.json" />
      <title>Tasks - Developer Sam Apps</title>
    </Head>
    <ConfiguredMainAppBarrier appComponent={HomePage} />
  </ReactReduxProvider>
);
