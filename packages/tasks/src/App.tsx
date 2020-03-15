import React, { ReactElement } from 'react';
import MaterialThemedApp from 'lib-react/MaterialThemedApp';
import MaterialButtonLink from 'lib-react/MaterialButtonLink';
import LandingPage from './components/pages/LandingPage';
import LoadingPage from './components/pages/LoadingPage';
import MainAppBarrier from './components/util/MainAppBarrier';
import { APP_NAME } from './util/constants';
import styles from './App.module.css';

const buttons: ReactElement = (
  <MaterialButtonLink href="https://developersam.com" color="inherit">
    Home
  </MaterialButtonLink>
);
const appStyles = { app: styles.App, title: styles.Title };

const Production = (): ReactElement => (
  <h1 style={{ textAlign: 'center' }}>Under active development...</h1>
);

const Development = (): ReactElement => (
  <div style={{ textAlign: 'center' }}>All data have been loaded.</div>
);

const Main = (): ReactElement =>
  process.env.NODE_ENV === 'production' ? <Production /> : <Development />;

const mockDataLoader = (): Promise<void> =>
  new Promise(resolve => {
    setTimeout(() => resolve(), 1000);
  });

export default (): ReactElement => (
  <MaterialThemedApp styles={appStyles} title={APP_NAME} buttons={buttons}>
    <MainAppBarrier
      dataLoader={mockDataLoader}
      landingPageComponent={LandingPage}
      loadingPageComponent={LoadingPage}
      appComponent={Main}
    />
  </MaterialThemedApp>
);
