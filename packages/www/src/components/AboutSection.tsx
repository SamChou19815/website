import React, { ReactElement } from 'react';

import ButtonLink from './Common/ButtonLink';
import ConsoleSection from './Common/ConsoleSection';
import WwwSvgIcon from './Common/Icons';
import InformationCard from './InformationCard';

const AboutSection = (): ReactElement => (
  <ConsoleSection
    id="about"
    title="dev-sam about"
    className="about-section"
    titleClassName="about-section-title"
  >
    <InformationCard className="about-section-info-card" />
    <ButtonLink className="about-section-read-more" href="#projects">
      READ MORE
      <WwwSvgIcon iconName="expand-more" />
    </ButtonLink>
  </ConsoleSection>
);

export default AboutSection;
