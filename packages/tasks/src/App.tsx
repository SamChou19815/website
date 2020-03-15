import React, { ReactElement } from 'react';
import { Provider as ReactReduxProvider } from 'react-redux';
import MaterialThemedApp from 'lib-react/MaterialThemedApp';
import MaterialButtonLink from 'lib-react/MaterialButtonLink';
import LandingPage from './components/pages/LandingPage';
import LoadingPage from './components/pages/LoadingPage';
import MainAppBarrier from './components/util/MainAppBarrier';
import { APP_NAME } from './util/constants';
import styles from './App.module.css';
import { getRootObservable } from './util/firestore';
import { patchAction, store } from './models/redux-store';

const buttons: ReactElement = (
  <MaterialButtonLink href="https://developersam.com" color="inherit">
    Home
  </MaterialButtonLink>
);

const dataLoader = (): Promise<void> => {
  const rootObservable = getRootObservable();
  let resolved = false;
  return new Promise(resolve => {
    rootObservable.subscribe(allFirestoreUserData => {
      store.dispatch(patchAction(allFirestoreUserData));
      if (!resolved) {
        resolved = true;
        resolve();
      }
    });
  });
};

const Main = (): ReactElement => (
  <ReactReduxProvider store={store}>
    <div style={{ textAlign: 'center' }}>All data have been loaded.</div>
  </ReactReduxProvider>
);

export default (): ReactElement => (
  <MaterialThemedApp
    title={APP_NAME}
    buttons={buttons}
    styles={{ app: styles.App, title: styles.Title }}
  >
    <MainAppBarrier
      dataLoader={dataLoader}
      landingPageComponent={LandingPage}
      loadingPageComponent={LoadingPage}
      appComponent={Main}
    />
  </MaterialThemedApp>
);
