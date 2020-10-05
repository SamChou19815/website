import React, { ReactElement } from 'react';

import AboutSection from './AboutSection';
import styles from './App.module.css';
import ProjectsSection from './ProjectsSection';
import StickyCodeBlock from './StickyCodeBlock';
import TechTalkSection from './TechTalkSection';
import TimelineSection from './TimelineSection';
import WebTerminal from './WebTerminal';
import { WebTerminalCommandsContextProvider } from './WebTerminal/WebTerminalCommandsContext';
import commands from './WebTerminal/commands';

const App = (): ReactElement => (
  <WebTerminalCommandsContextProvider value={commands}>
    <div className={styles.MainLayout}>
      <div className={styles.SideBar}>
        <StickyCodeBlock />
      </div>
      <div className={styles.ContentBlock}>
        <AboutSection />
        <ProjectsSection />
        <TechTalkSection />
        <TimelineSection />
      </div>
    </div>
    <WebTerminal />
  </WebTerminalCommandsContextProvider>
);

export default App;
