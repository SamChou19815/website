// @flow strict

import type { Node } from 'react';
import React from 'react';
// $FlowFixMe
import Card from '@material-ui/core/Card';
// $FlowFixMe
import CardHeader from '@material-ui/core/CardHeader';
// $FlowFixMe
import CardContent from '@material-ui/core/CardContent';
// $FlowFixMe
import Icon from '@material-ui/core/Icon';
import styles from './FirstPage.module.css';
import FirstPageCodeBlock from './FirstPageCodeBlock';

const IconLine = ({ icon, children }: {| +icon: string; +children: string |}): Node => (
  <CardContent className={styles.IconLine}>
    <Icon>{icon}</Icon>
    <span className={styles.IconLineText}>{children}</span>
  </CardContent>
);

export default (): Node => (
  <div className={styles.FirstPage}>
    <FirstPageCodeBlock />
    <Card className={styles.InfoCard}>
      <CardHeader title="Sam Zhou" />
      <IconLine icon="work">Facebook SWE Intern</IconLine>
      <IconLine icon="work">Cornell DTI TPM</IconLine>
      <IconLine icon="school">Cornell University</IconLine>
      <IconLine icon="domain">Computer Science</IconLine>
      <IconLine icon="bar_chart">GPA: 4.18/4.3</IconLine>
      <IconLine icon="code">Coding since 13</IconLine>
    </Card>
  </div>
);
