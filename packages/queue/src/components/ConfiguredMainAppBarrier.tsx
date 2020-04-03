import React, { ReactElement } from 'react';

import { ignore } from 'lib-common';
import AppBarrier from 'lib-firebase/AppBarrier';

import LandingPage from './LandingPage';
import LoadingPage from './LoadingPage';

export default ({ appComponent }: { readonly appComponent: () => ReactElement }): ReactElement => (
  <AppBarrier
    isDataLoaded
    dataLoader={ignore}
    landingPageComponent={LandingPage}
    loadingPageComponent={LoadingPage}
    appComponent={appComponent}
  />
);
