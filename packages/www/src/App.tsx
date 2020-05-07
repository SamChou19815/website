import React, { ReactElement, Suspense, lazy } from 'react';

import MaterialButtonLink from 'lib-react/MaterialButtonLink';
import MaterialThemedApp from 'lib-react/MaterialThemedApp';
import { Provider as ReactReduxProvider } from 'react-redux';

import styles from './App.module.css';
import FirstPage from './components/FirstPage';
import ProjectsSection from './components/ProjectsSection';
import TechTalkSection from './components/TechTalkSection';
import TimelineSection from './components/TimelineSection';
import { store } from './store';

const WebTerminal = lazy(() => import('./components/WebTerminal'));

const buttons: ReactElement = (
  <>
    <MaterialButtonLink href="https://blog.developersam.com" color="inherit">
      Blog
    </MaterialButtonLink>
    <MaterialButtonLink href="https://github.com/SamChou19815" color="inherit">
      GitHub
    </MaterialButtonLink>
  </>
);

const appStyles = {
  appBar: styles.AppBar,
  title: styles.Title,
};

export default (): ReactElement => (
  <ReactReduxProvider store={store}>
    <MaterialThemedApp
      title="Developer Sam"
      appBarPosition="fixed"
      styles={appStyles}
      buttons={buttons}
    >
      <FirstPage />
      <ProjectsSection />
      <TechTalkSection />
      <TimelineSection />
      <Suspense fallback={null}>
        <WebTerminal />
      </Suspense>
    </MaterialThemedApp>
  </ReactReduxProvider>
);
