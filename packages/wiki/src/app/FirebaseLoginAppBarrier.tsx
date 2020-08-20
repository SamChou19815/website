import React, { ReactElement, useState, useEffect } from 'react';

import './firebase-initializer';
import firebase from 'firebase/app';

import App from './App';
import { appUser$, hasAppUser } from './authentication';

const firebaseLoginProvider = new firebase.auth.GithubAuthProvider();

const onLoginClick = () => {
  firebase.auth().signInWithPopup(firebaseLoginProvider);
};

const LoadingPage = () => <div className="simple-page-center">Loading...</div>;

type Props = {
  /** Whether all data has been loaded. */
  readonly isDataLoaded: boolean;
  /**
   * The function that will be called once the login finishes.
   * The returned promise should resolve when all data has been loaded and stored.
   */
  readonly dataLoader: () => void;
};
type AppStatus = 'INIT_LOADING' | 'LANDING' | 'DATA_LOADING_OR_APP';

/**
 * The barrier to enter the main app.
 * It can help to enforce that all necessary information is loaded before entering the main app.
 */
const FirebaseLoginAppBarrier = ({ isDataLoaded, dataLoader }: Props): ReactElement => {
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
      return (
        <div className="simple-page-center">
          <button className="button button--primary" onClick={onLoginClick}>
            Login
          </button>
        </div>
      );
    case 'INIT_LOADING':
      return <LoadingPage />;
    case 'DATA_LOADING_OR_APP':
      return isDataLoaded ? <App /> : <LoadingPage />;
    default:
      throw new Error(`Unknown state: ${appStatus}`);
  }
};

export default FirebaseLoginAppBarrier;
