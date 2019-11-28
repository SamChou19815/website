import React, { ReactElement } from 'react';
import MaterialThemedApp from 'lib-react/MaterialThemedApp';
import MaterialButtonLink from 'lib-react/MaterialButtonLink';
import styles from './App.module.css';
import FirstPage from './components/FirstPage';
import ProjectsSection from './components/ProjectsSection';
import TimelineSection from './components/TimelineSection';
import TechTalkSection from './components/TechTalkSection';
import WebTerminal from './components/WebTerminal';

const buttons: ReactElement = (
  <>
    <MaterialButtonLink href="/transcript.pdf" color="inherit" className={styles.Hideable}>
      Transcript
    </MaterialButtonLink>
    <MaterialButtonLink href="/resume.pdf" color="inherit" className={styles.Hideable}>
      Resume
    </MaterialButtonLink>
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
  title: styles.Title
};

export default (): ReactElement => (
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
    <WebTerminal />
  </MaterialThemedApp>
);
