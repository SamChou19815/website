import React, { ReactElement } from 'react';

import Button from '@material-ui/core/Button';
import firebase from 'firebase/app';

import MaterialThemedNavigableAppContainer from '../util/MaterialThemedNavigableAppContainer';

const provider = new firebase.auth.GoogleAuthProvider();

const onLoginClick = () => {
  firebase.auth().signInWithPopup(provider);
};

export default (): ReactElement => (
  <MaterialThemedNavigableAppContainer>
    <div className="simple-page-center">
      <Button variant="contained" color="primary" onClick={onLoginClick}>
        Login
      </Button>
    </div>
  </MaterialThemedNavigableAppContainer>
);
