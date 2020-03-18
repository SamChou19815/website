import React, { ReactElement } from 'react';
import { Provider as ReactReduxProvider } from 'react-redux';
import LandingPage from './components/pages/LandingPage';
import LoadingPage from './components/pages/LoadingPage';
import MainAppBarrier from './components/util/MainAppBarrier';
import { getProjectsObservable, getTasksObservable } from './util/firestore';
import { getPatchProjectsAction, getPatchTasksAction, store } from './models/redux-store';
import RootRouter from './components/pages/RootRouter';

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
  <MainAppBarrier
    dataLoader={dataLoader}
    landingPageComponent={LandingPage}
    loadingPageComponent={LoadingPage}
    appComponent={Main}
  />
);
