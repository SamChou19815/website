import React, { ReactElement } from 'react';

import classnames from 'classnames';

import about from '../data/about';
import ButtonLink from './Common/ButtonLink';
import LazyCardMedia from './Common/LazyCardMedia';
import styles from './InformationCard.module.css';

type IconLineProps = {
  readonly Icon: () => ReactElement;
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
      <div className="button-group button-group--block">
        {about.links.map(({ href, text }) => (
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
