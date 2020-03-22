import React, { ReactElement, Suspense, lazy } from 'react';

import MaterialButtonLink from 'lib-react/MaterialButtonLink';
import MaterialThemedApp from 'lib-react/MaterialThemedApp';
import { Provider as ReactReduxProvider } from 'react-redux';

import styles from './App.module.css';
import FirstPage from './components/FirstPage';
import { store } from './store';

const ProjectsSection = lazy(() => import('./components/ProjectsSection'));
const TimelineSection = lazy(() => import('./components/TimelineSection'));
const TechTalkSection = lazy(() => import('./components/TechTalkSection'));
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
      <Suspense fallback={null}>
        <ProjectsSection />
      </Suspense>
      <Suspense fallback={null}>
        <TechTalkSection />
      </Suspense>
      <Suspense fallback={null}>
        <TimelineSection />
      </Suspense>
      <Suspense fallback={null}>
        <WebTerminal />
      </Suspense>
    </MaterialThemedApp>
  </ReactReduxProvider>
);
