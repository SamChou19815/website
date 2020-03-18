import React, { ReactElement, useEffect } from 'react';

import firebase from 'firebase/app';

import { setGAUser } from '../../util/analytics';
import { cacheAppUser, toAppUser } from '../../util/authentication';

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
type AppStatus = 'INIT_LOADING' | 'LANDING' | 'DATA_LOADING' | 'APP';

/**
 * The barrier to enter the main app.
 * It can help to enforce that all necessary information is loaded before entering the main app.
 */
export default ({
  dataLoader,
  loadingPageComponent: LoadingPage,
  landingPageComponent: LandingPage,
  appComponent: App
}: Props): ReactElement => {
  const [appStatus, setAppStatus] = React.useState<AppStatus>('INIT_LOADING');

  // Listen for auth state changes in effect hooks.
  useEffect(() => {
    return firebase.auth().onAuthStateChanged(async user => {
      const currentUserFromFirebase = await toAppUser(user);
      if (currentUserFromFirebase === null) {
        setAppStatus('LANDING');
        return;
      }
      setGAUser(currentUserFromFirebase);
      cacheAppUser(currentUserFromFirebase);
      setAppStatus('DATA_LOADING');
    });
  }, []);

  useEffect(() => {
    if (appStatus === 'DATA_LOADING') {
      dataLoader().then(() => setAppStatus('APP'));
    }
  }, [appStatus, dataLoader]);

  switch (appStatus) {
    case 'LANDING':
      return <LandingPage />;
    case 'INIT_LOADING':
    case 'DATA_LOADING':
      return <LoadingPage />;
    case 'APP':
      return <App />;
    default:
      throw new Error(`Unknown state: ${appStatus}`);
  }
};
