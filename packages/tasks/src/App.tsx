import React, { ReactElement } from 'react';
import { Provider as ReactReduxProvider } from 'react-redux';
import MaterialThemedApp from 'lib-react/MaterialThemedApp';
import MaterialButtonLink from 'lib-react/MaterialButtonLink';
import LandingPage from './components/pages/LandingPage';
import LoadingPage from './components/pages/LoadingPage';
import MainAppBarrier from './components/util/MainAppBarrier';
import { APP_NAME } from './util/constants';
import styles from './App.module.css';
import { getProjectsObservable, getTasksObservable } from './util/firestore';
import { getPatchProjectsAction, getPatchTasksAction, store } from './models/redux-store';
import RootRouter from './components/pages/RootRouter';

const buttons: ReactElement = (
  <MaterialButtonLink href="https://developersam.com" color="inherit">
    Home
  </MaterialButtonLink>
);

const dataLoader = (): Promise<void> => {
  const projectsObservable = getProjectsObservable();
  const tasksObservable = getTasksObservable();
  let resolvedProjects = false;
  let resolvedTasks = false;
  return new Promise(resolve => {
    projectsObservable.subscribe(({ createdAndEdited, deleted }) => {
      store.dispatch(getPatchProjectsAction(createdAndEdited, deleted));
      if (!resolvedProjects) {
        resolvedProjects = true;
        if (resolvedTasks) {
          resolve();
        }
      }
    });
    tasksObservable.subscribe(({ createdAndEdited, deleted }) => {
      store.dispatch(getPatchTasksAction(createdAndEdited, deleted));
      if (!resolvedTasks) {
        resolvedTasks = true;
        if (resolvedProjects) {
          resolve();
        }
      }
    });
  });
};

const Main = (): ReactElement => (
  <ReactReduxProvider store={store}>
    <RootRouter />
  </ReactReduxProvider>
);

export default (): ReactElement => (
  <MaterialThemedApp
    title={APP_NAME}
    buttons={buttons}
    styles={{ app: styles.App, title: styles.Title }}
  >
    <MainAppBarrier
      dataLoader={dataLoader}
      landingPageComponent={LandingPage}
      loadingPageComponent={LoadingPage}
      appComponent={Main}
    />
  </MaterialThemedApp>
);
