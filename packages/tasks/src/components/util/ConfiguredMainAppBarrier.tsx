import React, { ReactElement } from 'react';

import AppBarrier from 'lib-firebase/AppBarrier';
import { useSelector } from 'react-redux';

import {
  getPatchProjectsAction,
  getPatchTasksAction,
  store,
  signalDataLoadedAction,
} from '../../models/redux-store';
import { ReduxStoreState } from '../../models/redux-store-types';
import { getProjectsObservable, getTasksObservable } from '../../util/firestore';
import LandingPage from '../pages/LandingPage';
import LoadingPage from '../pages/LoadingPage';

const dataLoader = (): void => {
  const projectsObservable = getProjectsObservable();
  const tasksObservable = getTasksObservable();
  let resolvedProjects = false;
  let resolvedTasks = false;
  projectsObservable.subscribe(({ createdAndEdited, deleted }) => {
    store.dispatch(getPatchProjectsAction(createdAndEdited, deleted));
    if (!resolvedProjects) {
      resolvedProjects = true;
      if (resolvedTasks) {
        store.dispatch(signalDataLoadedAction);
      }
    }
  });
  tasksObservable.subscribe(({ createdAndEdited, deleted }) => {
    store.dispatch(getPatchTasksAction(createdAndEdited, deleted));
    if (!resolvedTasks) {
      resolvedTasks = true;
      if (resolvedProjects) {
        store.dispatch(signalDataLoadedAction);
      }
    }
  });
};

export default ({ appComponent }: { readonly appComponent: () => ReactElement }): ReactElement => {
  const isDataLoaded = useSelector(({ dataLoaded }: ReduxStoreState) => dataLoaded);
  return (
    <AppBarrier
      isDataLoaded={isDataLoaded}
      dataLoader={dataLoader}
      landingPageComponent={LandingPage}
      loadingPageComponent={LoadingPage}
      appComponent={appComponent}
    />
  );
};
