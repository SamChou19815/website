import clsx from 'clsx';
import React, { ReactElement } from 'react';

import DATASET_ABOUT from '../data/about';
import ButtonLink from './Common/ButtonLink';
import WwwSvgIcon from './Common/Icons';
import LazyCardMedia from './Common/LazyCardMedia';
import ProfilePicture from './ProfilePicture';

const InformationCard = ({ className }: { readonly className?: string }): ReactElement => (
  <div className={clsx('card', 'info-card', className)}>
    <LazyCardMedia image="/timeline/fb-hacker-way.webp" title="Facebook @ 1 Hacker Way" />
    <div className="card__header">
      <div className="avatar">
        <ProfilePicture />
        <div className="avatar__intro">
          <h4 className="avatar__name">Sam Zhou</h4>
        </div>
      </div>
    </div>
    <div className="card__body icon-lines">
      {DATASET_ABOUT.facts.map(({ text, iconName }) => (
        <div key={text} className="line">
          <WwwSvgIcon iconName={iconName} />
          <span className="text">{text}</span>
        </div>
      ))}
    </div>
    <div className="card__footer horizontal-center">
      <div className="button-group button-group--block">
        {DATASET_ABOUT.links.map(({ href, text }) => (
          <ButtonLink key={text} href={href} className="link">
            {text}
          </ButtonLink>
        ))}
      </div>
    </div>
  </div>
);

export default InformationCard;
