// @flow strict
/* eslint-disable react/no-array-index-key */

import type { Node } from 'react';
import React from 'react';
import ConsoleSection from '../Common/ConsoleSection';
import items from './items';
import TimelineItemCard from './TimelineItemCard';
import styles from './TimelineSection.module.css';

export default (): Node => (
  <ConsoleSection id="timeline" title="./timeline --fancy">
    <div className={styles.TimelineSection}>
      <div className={styles.VerticalBar} />
      {items.map((item, index) => <TimelineItemCard key={index} item={item} />)}
    </div>
  </ConsoleSection>
);
