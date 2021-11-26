import React, { ReactNode, useEffect } from 'react';

import WwwSvgIcon from './Icons';
import ProfilePicture from './ProfilePicture';
import StickyCodeBlock from './StickyCodeBlock';
import WebTerminalAppWrapper from './WebTerminalAppWrapper';
import { DATASET_ABOUT, DATASET_PROJECTS, DATASET_TECH_TALKS, DATASET_TIMELINE } from './data';
import { useSetDeveloperSamOnBirthday } from './global-states';

type ButtonLinkProps = {
  readonly href: string;
  readonly className?: string;
  readonly children: ReactNode;
};
function ButtonLink({ href, children, className }: ButtonLinkProps): JSX.Element {
  return (
    <a
      className={className == null ? 'button button--link' : `button button--link ${className}`}
      href={href}
    >
      {typeof children === 'string' ? children.toLocaleUpperCase() : children}
    </a>
  );
}

type CardHeaderProps = { readonly title: string; readonly subheader?: string };
function CardHeader({ title, subheader }: CardHeaderProps): JSX.Element {
  return (
    <div className="card__header">
      <div className="avatar">
        <div className="avatar__intro">
          <h4 className="avatar__name">{title}</h4>
          {subheader && <small className="avatar__subtitle">{subheader}</small>}
        </div>
      </div>
    </div>
  );
}

type ConsoleSectionProps = {
  readonly id: string;
  readonly title: string;
  readonly className?: string;
  readonly titleClassName?: string;
  readonly children: ReactNode;
};
function ConsoleSection({
  id,
  title,
  className,
  titleClassName,
  children,
}: ConsoleSectionProps): JSX.Element {
  return (
    <section id={id} className={className}>
      <h3
        className={
          titleClassName == null
            ? 'console-section-title'
            : `console-section-title ${titleClassName}`
        }
      >
        <code>
          $&nbsp;
          {title}
        </code>
      </h3>
      {children}
    </section>
  );
}

type LazyCardMediaProps = { readonly image: string; readonly title: string };
function LazyCardMedia({ image, title }: LazyCardMediaProps): JSX.Element {
  return (
    <div className="card__image">
      <img src={image} alt={title} title={title} loading="lazy" />
    </div>
  );
}

const aboutSection = (
  <ConsoleSection id="about" title="dev-sam about" className="about-section" titleClassName="title">
    <div className="card info-card">
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
    <ButtonLink className="read-more" href="#projects">
      READ MORE
      <WwwSvgIcon iconName="expand-more" />
    </ButtonLink>
  </ConsoleSection>
);

const projectSection = (
  <ConsoleSection id="projects" title="dev-sam projects">
    <div className="card-container">
      {DATASET_PROJECTS.map(({ name, type, media, description, links }) => (
        <div key={name} className="card responsive-card">
          <LazyCardMedia image={media} title={name} />
          <CardHeader title={name} subheader={type} />
          <div className="card__body">{description}</div>
          <div className="card__footer">
            <div className="button-group button-group--block">
              {links.map(({ text, href }) => (
                <ButtonLink key={text} href={href}>
                  {text}
                </ButtonLink>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </ConsoleSection>
);

const techTalkSection = (
  <ConsoleSection id="tech-talks" title="dev-sam tech-talks">
    <div className="card-container">
      {DATASET_TECH_TALKS.map(({ title, description, link }) => (
        <div key={title} className="card responsive-card">
          <CardHeader title={title} />
          <div className="card__body">{description}</div>
          <div className="card__footer">
            <a href={link} className="button button--link">
              SLIDES
            </a>
          </div>
        </div>
      ))}
    </div>
  </ConsoleSection>
);

const timelineSection = (
  <ConsoleSection id="timeline" title="dev-sam timeline">
    <div className="timeline-section">
      <div className="vertical-bar" />
      {DATASET_TIMELINE.map((item) => (
        <div key={`${item.title}-${item.time}`} className="card-container">
          <div className="content-wrapper">
            <span className="connector-dot" />
            <div className="card">
              {item.image != null && <LazyCardMedia image={item.image} title={item.title} />}
              <CardHeader title={item.title} subheader={item.time} />
              {item.detail != null && <div className="card__body">{item.detail}</div>}
              {item.links != null && (
                <div className="card__footer">
                  {item.links.map(
                    ({ name, url }, index): JSX.Element => (
                      <ButtonLink key={index} href={url}>
                        {name}
                      </ButtonLink>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </ConsoleSection>
);

export default function AppContent(): JSX.Element {
  const setOnBirthday = useSetDeveloperSamOnBirthday();

  useEffect(() => {
    const interval = setInterval(() => {
      const today = new Date();
      const onBirthday = today.getMonth() === 10 && today.getDate() === 15;
      setOnBirthday(onBirthday);
    }, 200);
    return () => clearInterval(interval);
  }, [setOnBirthday]);

  return (
    <>
      <div className="app-main-layout">
        <div className="side-bar">
          <StickyCodeBlock />
        </div>
        <div className="content-block">
          {aboutSection}
          {projectSection}
          {techTalkSection}
          {timelineSection}
        </div>
      </div>
      <WebTerminalAppWrapper />
    </>
  );
}
