import React, { ReactElement } from 'react';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import Code from '@material-ui/icons/Code';
import Domain from '@material-ui/icons/Domain';
import Facebook from '@material-ui/icons/Facebook';
import GitHub from '@material-ui/icons/GitHub';
import School from '@material-ui/icons/School';
import Work from '@material-ui/icons/Work';

import styles from './InformationCard.module.css';

import MaterialButtonLink from 'lib-react/MaterialButtonLink';

type IconLineProps = {
  readonly Icon: (props: SvgIconProps) => ReactElement;
  readonly children: string;
};

const IconLine = ({ Icon, children }: IconLineProps): ReactElement => (
  <CardContent className={styles.IconLine}>
    <Icon />
    <span className={styles.IconLineText}>{children}</span>
  </CardContent>
);

const InformationCard = (): ReactElement => (
  <Card className={styles.InfoCard}>
    <CardHeader title="Sam Zhou" />
    <IconLine Icon={Work}>Cornell DTI Dev Lead</IconLine>
    <IconLine Icon={Facebook}>Facebook SWE Intern</IconLine>
    <IconLine Icon={GitHub}>Open source contributor</IconLine>
    <IconLine Icon={School}>Cornell University</IconLine>
    <IconLine Icon={Domain}>Computer Science</IconLine>
    <IconLine Icon={Code}>Coding since 13</IconLine>
    <CardActions>
      <MaterialButtonLink href="/resume.pdf">Resume</MaterialButtonLink>
      <MaterialButtonLink href="/transcript.pdf">Transcript</MaterialButtonLink>
    </CardActions>
  </Card>
);

export default InformationCard;
