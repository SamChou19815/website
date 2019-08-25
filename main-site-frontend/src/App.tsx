import React, { ReactElement } from 'react';
import MaterialThemedApp from 'sam-react-common/MaterialThemedApp';
import MaterialButtonLink from 'sam-react-common/MaterialButtonLink';
import styles from './App.module.css';
import FirstPage from './components/FirstPage';
import ProjectsSection from './components/ProjectsSection';
import TimelineSection from './components/TimelineSection';
import TechTalkSection from './components/TechTalkSection';

const buttons: ReactElement = (
  <>
    <MaterialButtonLink href="/resume.pdf" color="inherit" openInNewTab className={styles.Resume}>
      Resume
    </MaterialButtonLink>
    <MaterialButtonLink href="https://blog.developersam.com" color="inherit" openInNewTab>
      Blog
    </MaterialButtonLink>
    <MaterialButtonLink href="https://github.com/SamChou19815" color="inherit" openInNewTab>
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
  </MaterialThemedApp>
);
