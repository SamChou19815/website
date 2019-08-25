import React, { ReactElement } from 'react';
import MaterialThemedApp from 'sam-react-common/MaterialThemedApp';
import MaterialButtonLink from 'sam-react-common/MaterialButtonLink';
import styles from './App.module.css';
import LanguageDemo from './LanguageDemo';

const buttons: ReactElement = (
  <>
    <MaterialButtonLink href="https://samlang.developersam.com" color="inherit" openInNewTab>
      Docs
    </MaterialButtonLink>
    <MaterialButtonLink href="https://developersam.com" color="inherit" openInNewTab>
      Home
    </MaterialButtonLink>
  </>
);

const appStyles = {
  app: styles.App,
  title: styles.Title,
};

export default (): ReactElement => (
  <MaterialThemedApp styles={appStyles} title="SAMLANG Demo" buttons={buttons}>
    <LanguageDemo />
  </MaterialThemedApp>
);
