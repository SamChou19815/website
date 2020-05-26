import React, { ReactElement } from 'react';

import classnames from 'classnames';

import techTalks from '../data/tech-talks';
import CardHeader from './Common/CardHeader';
import ConsoleSection from './Common/ConsoleSection';
import styles from './TechTalkSection.module.css';

import MaterialButtonLink from 'lib-react/MaterialButtonLink';

const TechTalkSection = (): ReactElement => (
  <ConsoleSection id="tech-talks" title="dev-sam tech-talks">
    <div className={styles.TechTalkContainer}>
      {techTalks.map(({ title, type, description, link }) => (
        <div key={title} className={classnames('card', styles.TechTalkCard)}>
          <CardHeader title={title} subheader={type} />
          <div className="card__body">{description}</div>
          <div className="card__footer">
            <MaterialButtonLink href={link}>Slides</MaterialButtonLink>
          </div>
        </div>
      ))}
    </div>
  </ConsoleSection>
);

export default TechTalkSection;
