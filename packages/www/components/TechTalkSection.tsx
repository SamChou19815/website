import React, { ReactElement } from 'react';

import classnames from 'classnames';

import techTalks from '../data/tech-talks';
import CardHeader from './Common/CardHeader';
import ConsoleSection from './Common/ConsoleSection';
import styles from './TechTalkSection.module.css';

const TechTalkSection = (): ReactElement => (
  <ConsoleSection id="tech-talks" title="dev-sam tech-talks">
    <div className={styles.TechTalkContainer}>
      {techTalks.map(({ title, type, description, link }) => (
        <div key={title} className={classnames('card', styles.TechTalkCard)}>
          <CardHeader title={title} subheader={type} />
          <div className="card__body">{description}</div>
          <div className="card__footer">
            <a href={link} className="button button--link">
              SLIDES
            </a>
          </div>
        </div>
      ))}
    </div>
  </ConsoleSection>
);

export default TechTalkSection;
