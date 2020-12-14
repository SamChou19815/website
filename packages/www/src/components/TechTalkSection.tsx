import clsx from 'clsx';
import type { ReactElement } from 'react';

import DATASET_TECH_TALKS from '../data/tech-talks';
import CardHeader from './Common/CardHeader';
import styles from './TechTalkSection.module.css';

const TechTalkSection = (): ReactElement => (
  <div className={styles.TechTalkContainer}>
    {DATASET_TECH_TALKS.map(({ title, type, description, link }) => (
      <div key={title} className={clsx('card', styles.TechTalkCard)}>
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
);

export default TechTalkSection;
