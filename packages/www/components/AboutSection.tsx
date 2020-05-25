import React, { ReactElement } from 'react';

import styles from './AboutSection.module.css';
import ConsoleSection from './Common/ConsoleSection';
import InformationCard from './InformationCard';

const AboutSection = (): ReactElement => (
  <ConsoleSection
    id="about"
    title="dev-sam --about"
    className={styles.AboutSection}
    titleClassName={styles.Title}
  >
    <InformationCard className={styles.InfoCard} />
  </ConsoleSection>
);

export default AboutSection;
