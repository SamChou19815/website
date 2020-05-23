import React, { ReactElement } from 'react';

import { Provider as ReactReduxProvider } from 'react-redux';

import { store } from '../store';
import FirstPage from './FirstPage';
import ProjectsSection from './ProjectsSection';
import TechTalkSection from './TechTalkSection';
import TimelineSection from './TimelineSection';
import WebTerminal from './WebTerminal';

export default (): ReactElement => (
  <ReactReduxProvider store={store}>
    <FirstPage />
    <ProjectsSection />
    <TechTalkSection />
    <TimelineSection />
    <WebTerminal />
  </ReactReduxProvider>
);
