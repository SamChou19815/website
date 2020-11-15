import React, { ReactElement } from 'react';

import clsx from 'clsx';

import DATASET_ABOUT from '../data/about';
import ButtonLink from './Common/ButtonLink';
import WwwSvgIcon, { WwwSvgIconName } from './Common/Icons';
import LazyCardMedia from './Common/LazyCardMedia';
import styles from './InformationCard.module.css';
import ProfilePicture from './ProfilePicture';

type IconLineProps = {
  readonly iconName: WwwSvgIconName;
  readonly children: string;
};

const IconLine = ({ iconName, children }: IconLineProps): ReactElement => (
  <div className={styles.IconLine}>
    <WwwSvgIcon iconName={iconName} />
    <span className={styles.IconLineText}>{children}</span>
  </div>
);

const InformationCard = ({ className }: { readonly className?: string }): ReactElement => (
  <div className={clsx('card', className)}>
    <LazyCardMedia image="/timeline/fb-hacker-way.jpg" title="Facebook @ 1 Hacker Way" />
    <div className="card__header">
      <div className="avatar">
        <ProfilePicture />
        <div className="avatar__intro">
          <h4 className="avatar__name">Sam Zhou</h4>
        </div>
      </div>
    </div>
    <div className={clsx('card__body', styles.IconLines)}>
      {DATASET_ABOUT.facts.map(({ text, iconName }) => (
        <IconLine key={text} iconName={iconName}>
          {text}
        </IconLine>
      ))}
    </div>
    <div className={clsx('card__footer', styles.Links)}>
      <div className="button-group button-group--block">
        {DATASET_ABOUT.links.map(({ href, text }) => (
          <ButtonLink key={text} href={href} className={styles.Link}>
            {text}
          </ButtonLink>
        ))}
        <ButtonLink href="/resume.pdf" className={styles.Link}>
          Resume
        </ButtonLink>
      </div>
    </div>
  </div>
);

export default InformationCard;
