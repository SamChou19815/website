import React, { ReactElement } from 'react';

import { getPatchProjectsAction, getPatchTasksAction, store } from '../../models/redux-store';
import { getProjectsObservable, getTasksObservable } from '../../util/firestore';
import LandingPage from '../pages/LandingPage';
import LoadingPage from '../pages/LoadingPage';
import MainAppBarrier from './MainAppBarrier';

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

export default ({ appComponent }: { readonly appComponent: () => ReactElement }): ReactElement => (
  <MainAppBarrier
    dataLoader={dataLoader}
    landingPageComponent={LandingPage}
    loadingPageComponent={LoadingPage}
    appComponent={appComponent}
  />
);
