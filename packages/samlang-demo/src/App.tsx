import React, { ReactElement } from 'react';

import MaterialButtonLink from 'lib-react/MaterialButtonLink';
import MaterialThemedApp from 'lib-react/MaterialThemedApp';

import styles from './App.module.css';
import LanguageDemo from './LanguageDemo';

const buttons: ReactElement = (
  <>
    <MaterialButtonLink href="https://samlang.developersam.com" color="inherit">
      Docs
    </MaterialButtonLink>
    <MaterialButtonLink href="https://developersam.com" color="inherit">
      Home
    </MaterialButtonLink>
  </>
);

const appStyles = {
  app: styles.App,
  title: styles.Title
};

export default (): ReactElement => (
  <MaterialThemedApp styles={appStyles} title="SAMLANG Demo" buttons={buttons}>
    <LanguageDemo />
  </MaterialThemedApp>
);
