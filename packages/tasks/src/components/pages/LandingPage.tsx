import React, { ReactElement } from 'react';

import firebase from 'firebase/app';
import { FirebaseAuth } from 'react-firebaseui';

import MaterialThemedAppContainer from '../util/MaterialThemedAppContainer';
import styles from './LandingPage.module.css';

const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [{ provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID }],
  signInSuccessUrl: '/',
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false
  }
};

export default (): ReactElement => (
  <MaterialThemedAppContainer title="Login" buttons={null}>
    <div className={styles.LoginContainer}>
      <FirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </div>
  </MaterialThemedAppContainer>
);
