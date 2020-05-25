import React, { ReactElement } from 'react';

import { Provider as ReactReduxProvider } from 'react-redux';

import { store } from '../store';
import AboutSection from './AboutSection';
import styles from './App.module.css';
import ProjectsSection from './ProjectsSection';
import StickyCodeBlock from './StickyCodeBlock';
import TechTalkSection from './TechTalkSection';
import TimelineSection from './TimelineSection';
import WebTerminal from './WebTerminal';

export default (): ReactElement => (
  <ReactReduxProvider store={store}>
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
  </ReactReduxProvider>
);
