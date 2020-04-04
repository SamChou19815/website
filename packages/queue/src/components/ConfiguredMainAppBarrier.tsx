import React, { ReactElement } from 'react';

import AppBarrier from 'lib-firebase/AppBarrier';
import { useSelector } from 'react-redux';

import { store, getPatchAction } from '../models/redux-store';
import { ReduxStoreState } from '../models/types';
import { onQueueQuerySnapshot } from '../util/use-collections';
import LandingPage from './LandingPage';
import LoadingPage from './LoadingPage';

const dataLoader = (): void => {
  onQueueQuerySnapshot((queues) => store.dispatch(getPatchAction(queues)));
};

export default ({ appComponent }: { readonly appComponent: () => ReactElement }): ReactElement => {
  const isDataLoaded = useSelector((state: ReduxStoreState) => state.dataLoaded);

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
