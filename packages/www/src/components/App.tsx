import type { ReactElement } from 'react';

import AboutSection from './AboutSection';
import styles from './App.module.css';
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

  const timelineSectionTitle = getTimelineTitle(workChecked, projectsChecked, eventsChecked);

  return (
    <WebTerminalAppWrapper>
      <div className={styles.MainLayout}>
        <div className={styles.SideBar}>
          <StickyCodeBlock />
        </div>
        <div className={styles.ContentBlock}>
          <AboutSection />
          <ConsoleSection id="projects" title="dev-sam projects">
            <ProjectsSection />
          </ConsoleSection>
          <ConsoleSection id="tech-talks" title="dev-sam tech-talks">
            <TechTalkSection />
          </ConsoleSection>
          <ConsoleSection id="timeline" title={timelineSectionTitle}>
            <TimelineSection />
          </ConsoleSection>
        </div>
      </div>
    </WebTerminalAppWrapper>
  );
};

export default App;
