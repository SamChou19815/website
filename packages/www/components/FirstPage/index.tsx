import React, { ReactElement } from 'react';

import InformationCard from '../Common/InformationCard';
import FirstPageCodeBlock from './FirstPageCodeBlock';
import styles from './index.module.css';

export default (): ReactElement => (
  <div id="about" className={styles.FirstPage}>
    <FirstPageCodeBlock />
    <InformationCard />
  </div>
);
