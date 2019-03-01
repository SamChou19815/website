// @flow strict

import type { Node } from 'react';
import React from 'react';
// $FlowFixMe
import Card from '@material-ui/core/Card';
// $FlowFixMe
import CardHeader from '@material-ui/core/CardHeader';
// $FlowFixMe
import CardActions from '@material-ui/core/CardActions';
// $FlowFixMe
import CardContent from '@material-ui/core/CardContent';
// $FlowFixMe
import Icon from '@material-ui/core/Icon';
import styles from './FirstPage.module.css';
import FirstPageCodeBlock from './FirstPageCodeBlock';
import ButtonLink from '../Common/ButtonLink';

const IconLine = ({ icon, children }: {| +icon: string; +children: string |}): Node => (
  <CardContent className={styles.IconLine}>
    <Icon>{icon}</Icon>
    <span className={styles.IconLineText}>{children}</span>
  </CardContent>
);

export default (): Node => (
  <div id="about" className={styles.FirstPage}>
    <FirstPageCodeBlock />
    <Card className={styles.InfoCard}>
      <CardHeader avatar={<Icon>account_circle</Icon>} title="Sam Zhou" subheader="About Myself" />
      <IconLine icon="work">Facebook SWE Intern</IconLine>
      <IconLine icon="work">Cornell DTI TPM</IconLine>
      <IconLine icon="school">Cornell University</IconLine>
      <IconLine icon="domain">Computer Science</IconLine>
      <IconLine icon="bar_chart">GPA: 4.18/4.3</IconLine>
      <IconLine icon="code">Coding since 13</IconLine>
      <CardActions>
        <ButtonLink href="#projects">Projects</ButtonLink>
        <ButtonLink href="#timeline">Timeline</ButtonLink>
      </CardActions>
    </Card>
  </div>
);
