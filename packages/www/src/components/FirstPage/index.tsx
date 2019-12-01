import React, { ReactElement, Suspense, lazy } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import AccountCirlce from '@material-ui/icons/AccountCircle';
import Code from '@material-ui/icons/Code';
import Domain from '@material-ui/icons/Domain';
import School from '@material-ui/icons/School';
import Work from '@material-ui/icons/Work';
import MaterialButtonLink from 'lib-react/MaterialButtonLink';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import styles from './index.module.css';

const FirstPageCodeBlock = lazy(() => import('./FirstPageCodeBlock'));

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

export default (): ReactElement => (
  <div id="about" className={styles.FirstPage}>
    <Suspense fallback={<div style={{ width: '430px', height: '660px' }}>Loading...</div>}>
      <FirstPageCodeBlock />
    </Suspense>
    <Card className={styles.InfoCard}>
      <CardHeader avatar={<AccountCirlce />} title="Sam Zhou" subheader="About Myself" />
      <IconLine Icon={Work}>Cornell DTI Dev Lead</IconLine>
      <IconLine Icon={Work}>Facebook SWE Intern</IconLine>
      <IconLine Icon={School}>Cornell University</IconLine>
      <IconLine Icon={Domain}>Computer Science</IconLine>
      <IconLine Icon={Code}>Coding since 13</IconLine>
      <CardActions>
        <MaterialButtonLink href="#projects">Projects</MaterialButtonLink>
        <MaterialButtonLink href="#tech-talks">Talks</MaterialButtonLink>
        <MaterialButtonLink href="#timeline">Timeline</MaterialButtonLink>
      </CardActions>
    </Card>
  </div>
);
