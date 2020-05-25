import React, { ReactElement } from 'react';

import { useSelector } from 'react-redux';

import { getPatchTasksAction, store } from '../../models/redux-store';
import { ReduxStoreState } from '../../models/redux-store-types';
import { getTasksObservable } from '../../util/firestore';
import LandingPage from '../pages/LandingPage';
import LoadingPage from '../pages/LoadingPage';

import AppBarrier from 'lib-firebase/AppBarrier';

const dataLoader = (): void => {
  const tasksObservable = getTasksObservable();
  tasksObservable.subscribe(({ createdAndEdited, deleted }) => {
    store.dispatch(getPatchTasksAction(createdAndEdited, deleted));
  });
};

const ConfiguredMainAppBarrier = ({
  appComponent,
}: {
  readonly appComponent: () => ReactElement;
}): ReactElement => {
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

export default ConfiguredMainAppBarrier;
