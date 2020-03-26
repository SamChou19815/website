import React, { ReactElement, useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

import { ReduxStoreState } from '../../models/redux-store-types';
import { appUser$, hasAppUser } from '../../util/authentication';

type Props = {
  /**
   * The function that will be called once the login finishes.
   * The returned promise should resolve when all data has been loaded and stored.
   */
  readonly dataLoader: () => Promise<void>;
  /** The component to render when the app's status is pending. */
  readonly loadingPageComponent: () => ReactElement;
  /** The component to render when the app first displays. */
  readonly landingPageComponent: () => ReactElement;
  /** The component to render when the login flow finishes. */
  readonly appComponent: () => ReactElement;
};
type AppStatus = 'INIT_LOADING' | 'LANDING' | 'DATA_LOADING_OR_APP';

/**
 * The barrier to enter the main app.
 * It can help to enforce that all necessary information is loaded before entering the main app.
 */
export default ({
  dataLoader,
  loadingPageComponent: LoadingPage,
  landingPageComponent: LandingPage,
  appComponent: App,
}: Props): ReactElement => {
  const isDataLoaded = useSelector(({ dataLoaded }: ReduxStoreState) => dataLoaded);
  const [appStatus, setAppStatus] = useState<AppStatus>(
    hasAppUser() ? 'DATA_LOADING_OR_APP' : 'INIT_LOADING'
  );

  // Listen for auth state changes in effect hooks.
  useEffect(() => {
    const subscription = appUser$.subscribe((currentUserFromFirebase) => {
      if (currentUserFromFirebase === null) {
        setAppStatus('LANDING');
        return;
      }
      setAppStatus('DATA_LOADING_OR_APP');
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (appStatus === 'DATA_LOADING_OR_APP' && !isDataLoaded) {
      dataLoader();
    }
  }, [appStatus, dataLoader, isDataLoaded]);

  switch (appStatus) {
    case 'LANDING':
      return <LandingPage />;
    case 'INIT_LOADING':
      return <LoadingPage />;
    case 'DATA_LOADING_OR_APP':
      return isDataLoaded ? <App /> : <LoadingPage />;
    default:
      throw new Error(`Unknown state: ${appStatus}`);
  }
};
