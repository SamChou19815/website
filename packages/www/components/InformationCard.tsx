import React, { ReactElement } from 'react';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { SvgIconProps } from '@material-ui/core/SvgIcon';

import about from '../data/about';
import LazyMaterialMedia from './Common/LazyMaterialMedia';
import styles from './InformationCard.module.css';

import MaterialButtonLink from 'lib-react/MaterialButtonLink';

type IconLineProps = {
  readonly Icon: (props: SvgIconProps) => ReactElement;
  readonly children: string;
};

const IconLine = ({ Icon, children }: IconLineProps): ReactElement => (
  <div className={styles.IconLine}>
    <Icon />
    <span className={styles.IconLineText}>{children}</span>
  </div>
);

const InformationCard = ({ className }: { readonly className?: string }): ReactElement => (
  <Card className={className}>
    <LazyMaterialMedia image="/timeline/fb-hacker-way.jpg" title="Facebook @ 1 Hacker Way" />
    <CardHeader title="Sam Zhou" className={styles.Links} />
    <CardContent className={styles.IconLines}>
      {about.facts.map(({ text, icon }) => (
        <IconLine key={text} Icon={icon}>
          {text}
        </IconLine>
      ))}
    </CardContent>
    <CardActions className={styles.Links}>
      {about.links.map(({ href, text }) => (
        <MaterialButtonLink key={text} href={href}>
          {text}
        </MaterialButtonLink>
      ))}
      <MaterialButtonLink href="/resume.pdf">Resume</MaterialButtonLink>
      <MaterialButtonLink href="/transcript.pdf" className={styles.Transcript}>
        Transcript
      </MaterialButtonLink>
    </CardActions>
  </Card>
);

export default InformationCard;
