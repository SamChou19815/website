import React, { ReactElement } from 'react';

import firebase from 'firebase/app';
import { FirebaseAuth } from 'react-firebaseui';

import MaterialThemedApp from './MaterialThemedApp';

const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [{ provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID }],
  signInSuccessUrl: '/',
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};

export default (): ReactElement => (
  <MaterialThemedApp title="Login">
    <div className="simple-page-center">
      <FirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </div>
  </MaterialThemedApp>
);
