import React, { ReactElement, useState, useEffect } from 'react';

import './firebase-initializer';
import firebase from 'firebase/app';

import LoadingOverlay from './LoadingOverlay';
import { appUser$, hasAppUser } from './authentication';

const firebaseLoginProvider = new firebase.auth.GithubAuthProvider();

const onLoginClick = () => {
  firebase.auth().signInWithPopup(firebaseLoginProvider);
};

type Props = {
  /** The child to render when the barrier is cleared. */
  readonly children: ReactElement;
};
type AppStatus = 'INIT_LOADING' | 'LANDING' | 'APP';

/**
 * The barrier to enter the main app.
 * It can help to enforce that all necessary information is loaded before entering the main app.
 */
const FirebaseLoginAppBarrier = ({ children }: Props): ReactElement => {
  const [appStatus, setAppStatus] = useState<AppStatus>(hasAppUser() ? 'APP' : 'INIT_LOADING');

  // Listen for auth state changes in effect hooks.
  useEffect(() => {
    const subscription = appUser$.subscribe((currentUserFromFirebase) => {
      if (currentUserFromFirebase === null) {
        setAppStatus('LANDING');
        return;
      }
      setAppStatus('APP');
    });
    return () => subscription.unsubscribe();
  }, []);

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
      return <LoadingOverlay />;
    case 'APP':
      return children;
    default:
      throw new Error(`Unknown state: ${appStatus}`);
  }
};

export default FirebaseLoginAppBarrier;
