import React, { ReactElement } from 'react';

import AboutSection from './AboutSection';
import ConsoleSection from './Common/ConsoleSection';
import ProjectsSection from './ProjectsSection';
import StickyCodeBlock from './StickyCodeBlock';
import TechTalkSection from './TechTalkSection';
import TimelineSection from './TimelineSection';
import WebTerminalAppWrapper from './WebTerminalAppWrapper';
import { useTimelinePillsState } from './global-states';

const getTimelineTitle = (
  workChecked: boolean,
  projectsChecked: boolean,
  eventsChecked: boolean
): string => {
  let title = 'dev-sam timeline';
  if (workChecked && projectsChecked && eventsChecked) {
    return title;
  }
  if (!workChecked && !projectsChecked && !eventsChecked) {
    title += ' --none';
  } else {
    title += ' --only';
    if (workChecked) {
      title += ' work';
    }
    if (projectsChecked) {
      title += ' projects';
    }
    if (eventsChecked) {
      title += ' events';
    }
  }
  return title;
};

const App = (): ReactElement => {
  const [{ workChecked, projectsChecked, eventsChecked }] = useTimelinePillsState();

  return (
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
          <ConsoleSection
            id="timeline"
            title={getTimelineTitle(workChecked, projectsChecked, eventsChecked)}
          >
            <TimelineSection />
          </ConsoleSection>
        </div>
      </div>
      <WebTerminalAppWrapper />
    </>
  );
};

export default App;
