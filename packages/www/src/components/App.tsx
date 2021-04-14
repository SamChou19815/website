import React, { ReactElement } from 'react';

import AboutSection from './AboutSection';
import ConsoleSection from './Common/ConsoleSection';
import ProjectsSection from './ProjectsSection';
import StickyCodeBlock from './StickyCodeBlock';
import TechTalkSection from './TechTalkSection';
import TimelineSection from './TimelineSection';
import WebTerminalAppWrapper from './WebTerminalAppWrapper';

const App = (): ReactElement => (
  <>
    <div className="app-main-layout">
      <div className="side-bar">
        <StickyCodeBlock />
      </div>
      <div className="content-block">
        <AboutSection />
        <ConsoleSection id="projects" title="dev-sam projects">
          <ProjectsSection />
        </ConsoleSection>
        <ConsoleSection id="tech-talks" title="dev-sam tech-talks">
          <TechTalkSection />
        </ConsoleSection>
        <ConsoleSection id="timeline" title="dev-sam timeline">
          <TimelineSection />
        </ConsoleSection>
      </div>
    </div>
    <WebTerminalAppWrapper />
  </>
);

export default App;
