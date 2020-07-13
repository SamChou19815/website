import React, { ReactElement } from 'react';

import styles from './AboutSection.module.css';
import ButtonLink from './Common/ButtonLink';
import ConsoleSection from './Common/ConsoleSection';
import { ExpandMoreIcon } from './Common/Icons';
import InformationCard from './InformationCard';

const AboutSection = (): ReactElement => (
  <ConsoleSection
    id="about"
    title="dev-sam about"
    className={styles.AboutSection}
    titleClassName={styles.Title}
  >
    <InformationCard className={styles.InfoCard} />
    <ButtonLink className={styles.ReadMore} href="#projects">
      READ MORE
      <ExpandMoreIcon />
    </ButtonLink>
  </ConsoleSection>
);

export default AboutSection;
