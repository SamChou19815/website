import React, { ReactElement } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Icon from '@material-ui/core/Icon';
import styles from './index.module.css';
import FirstPageCodeBlock from './FirstPageCodeBlock';
import ButtonLink from '../Common/ButtonLink';

type IconLineProps = {
  readonly icon: string;
  readonly children: string;
}

const IconLine = ({ icon, children }: IconLineProps): ReactElement => (
  <CardContent className={styles.IconLine}>
    <Icon>{icon}</Icon>
    <span className={styles.IconLineText}>{children}</span>
  </CardContent>
);

export default (): ReactElement => (
  <div id="about" className={styles.FirstPage}>
    <FirstPageCodeBlock />
    <Card className={styles.InfoCard}>
      <CardHeader avatar={<Icon>account_circle</Icon>} title="Sam Zhou" subheader="About Myself" />
      <IconLine icon="work">Facebook SWE Intern</IconLine>
      <IconLine icon="work">Cornell DTI Dev Lead</IconLine>
      <IconLine icon="school">Cornell University</IconLine>
      <IconLine icon="domain">Computer Science</IconLine>
      <IconLine icon="bar_chart">GPA: 4.18/4.3</IconLine>
      <IconLine icon="code">Coding since 13</IconLine>
      <CardActions>
        <ButtonLink href="#projects">Projects</ButtonLink>
        <ButtonLink href="#tech-talks">Talks</ButtonLink>
        <ButtonLink href="#timeline">Timeline</ButtonLink>
      </CardActions>
    </Card>
  </div>
);
