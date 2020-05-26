import React, { ReactElement } from 'react';

import { SvgIconProps } from '@material-ui/core/SvgIcon';
import classnames from 'classnames';

import about from '../data/about';
import LazyCardMedia from './Common/LazyCardMedia';
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
  <div className={classnames('card', className)}>
    <LazyCardMedia image="/timeline/fb-hacker-way.jpg" title="Facebook @ 1 Hacker Way" />
    <div className="card__header">
      <h3>Sam Zhou</h3>
    </div>
    <div className={classnames('card__body', styles.IconLines)}>
      {about.facts.map(({ text, icon }) => (
        <IconLine key={text} Icon={icon}>
          {text}
        </IconLine>
      ))}
    </div>
    <div className={classnames('card__footer', styles.Links)}>
      {about.links.map(({ href, text }) => (
        <MaterialButtonLink key={text} href={href}>
          {text}
        </MaterialButtonLink>
      ))}
      <MaterialButtonLink href="/resume.pdf">Resume</MaterialButtonLink>
      <MaterialButtonLink href="/transcript.pdf" className={styles.Transcript}>
        Transcript
      </MaterialButtonLink>
    </div>
  </div>
);

export default InformationCard;
