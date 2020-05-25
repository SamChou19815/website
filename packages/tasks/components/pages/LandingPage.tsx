import React, { ReactElement } from 'react';

import Button from '@material-ui/core/Button';
import firebase from 'firebase/app';

const provider = new firebase.auth.GoogleAuthProvider();

const onLoginClick = () => {
  firebase.auth().signInWithPopup(provider);
};

const LandingPage = (): ReactElement => (
  <div className="simple-page-center">
    <Button variant="contained" color="primary" onClick={onLoginClick}>
      Login
    </Button>
  </div>
);

export default LandingPage;
