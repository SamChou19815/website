import React, { ReactElement } from 'react';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import styles from './AboutSection.module.css';
import ConsoleSection from './Common/ConsoleSection';
import InformationCard from './InformationCard';

import MaterialButtonLink from 'lib-react/MaterialButtonLink';

const AboutSection = (): ReactElement => (
  <ConsoleSection
    id="about"
    title="dev-sam --about"
    className={styles.AboutSection}
    titleClassName={styles.Title}
  >
    <InformationCard className={styles.InfoCard} />
    <MaterialButtonLink
      className={styles.ReadMore}
      linkClassName={styles.ReadMoreLink}
      href="#projects"
    >
      Read more
      <ExpandMoreIcon />
    </MaterialButtonLink>
  </ConsoleSection>
);

export default AboutSection;
