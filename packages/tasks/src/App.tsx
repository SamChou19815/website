import React, { ReactElement } from 'react';

import { Provider as ReactReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import LandingPage from './components/pages/LandingPage';
import LoadingPage from './components/pages/LoadingPage';
import RootRouter from './components/pages/RootRouter';
import MainAppBarrier from './components/util/MainAppBarrier';
import { getPatchProjectsAction, getPatchTasksAction, store } from './models/redux-store';
import { getProjectsObservable, getTasksObservable } from './util/firestore';

const dataLoader = (): Promise<void> => {
  const projectsObservable = getProjectsObservable();
  const tasksObservable = getTasksObservable();
  let resolvedProjects = false;
  let resolvedTasks = false;
  return new Promise((resolve) => {
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
  <BrowserRouter>
    <MainAppBarrier
      dataLoader={dataLoader}
      landingPageComponent={LandingPage}
      loadingPageComponent={LoadingPage}
      appComponent={Main}
    />
  </BrowserRouter>
);
