import React, { ReactElement } from 'react';

import ButtonLink from './Common/ButtonLink';
import ConsoleSection from './Common/ConsoleSection';
import WwwSvgIcon from './Common/Icons';
import InformationCard from './InformationCard';

const AboutSection = (): ReactElement => (
  <ConsoleSection id="about" title="dev-sam about" className="about-section" titleClassName="title">
    <InformationCard className="info-card" />
    <ButtonLink className="read-more" href="#projects">
      READ MORE
      <WwwSvgIcon iconName="expand-more" />
    </ButtonLink>
  </ConsoleSection>
);

export default AboutSection;
