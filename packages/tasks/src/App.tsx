import React, { ReactElement } from 'react';
import MaterialThemedApp from 'lib-react/MaterialThemedApp';
import MaterialButtonLink from 'lib-react/MaterialButtonLink';
import styles from './App.module.css';

const buttons: ReactElement = (
  <>
    <MaterialButtonLink href="https://developersam.com" color="inherit">
      Home
    </MaterialButtonLink>
  </>
);

const appStyles = {
  app: styles.App,
  title: styles.Title
};

const Production = (): ReactElement => (
  <h1 style={{ textAlign: 'center' }}>Under active development...</h1>
);

const Development = (): ReactElement => <div />;

export default (): ReactElement => (
  <MaterialThemedApp styles={appStyles} title="Tasks" buttons={buttons}>
    {process.env.NODE_ENV === 'production' ? <Production /> : <Development />}
  </MaterialThemedApp>
);
