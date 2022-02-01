import React from 'react';
import ButtonLink from '../components/ButtonLink';
import Card from '../components/Card';
import CardContainer from '../components/CardContainer';
import CardHeader from '../components/CardHeader';
import ConsoleSection from '../components/ConsoleSection';
import {
  DATASET_ABOUT,
  DATASET_PROJECTS,
  DATASET_TECH_TALKS,
  DATASET_TIMELINE,
} from '../components/data';
import WwwSvgIcon from '../components/Icons';
import StickyCodeBlock from '../components/StickyCodeBlock';

function LazyCardMedia({ image, title }: { image: string; title: string }): JSX.Element {
  return <img src={image} alt={title} title={title} loading="lazy" />;
}

const AboutSection = (
  <ConsoleSection title="dev-sam about">
    <Card className="about-info-card mx-auto my-4 w-11/12">
      <div className="flex flex-row justify-center p-4">
        <div className="avatar flex items-center">
          <img
            className="mr-4 h-12 w-12 overflow-hidden rounded-full"
            src="/sam-by-megan-3-square.webp"
            alt="dev-sam fan art"
          />
          <h4 className="m-0">Sam Zhou</h4>
        </div>
      </div>
      <div className="grid grid-cols-1 justify-items-center p-4 sm:grid-cols-2 lg:grid-cols-2">
        {DATASET_ABOUT.facts.map(({ text, iconName }) => (
          <div key={text} className="m-2 flex w-40 content-center items-center">
            <WwwSvgIcon iconName={iconName} />
            <span className="ml-2">{text}</span>
          </div>
        ))}
      </div>
      <div className="p-4">
        <div className="flex flex-grow justify-evenly">
          {DATASET_ABOUT.links.map(({ href, text }) => (
            <ButtonLink key={text} href={href} className="link flex-grow">
              {text}
            </ButtonLink>
          ))}
        </div>
      </div>
    </Card>
  </ConsoleSection>
);

const ProjectSection = (
  <ConsoleSection title="dev-sam projects">
    <CardContainer className="my-4">
      {DATASET_PROJECTS.map(({ name, type, media, description, links }) => (
        <Card key={name} className="mx-auto my-4 w-11/12 md:m-4 md:w-96">
          <LazyCardMedia image={media} title={name} />
          <CardHeader title={name} subheader={type} />
          <div className="p-4 pb-0">{description}</div>
          <div className="p-4">
            <div className="flex flex-grow justify-evenly">
              {links.map(({ text, href }) => (
                <ButtonLink key={text} href={href} className="link flex-grow">
                  {text}
                </ButtonLink>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </CardContainer>
  </ConsoleSection>
);

const TechTalkSection = (
  <ConsoleSection title="dev-sam tech-talks">
    <CardContainer className="my-4">
      {DATASET_TECH_TALKS.map(({ title, description, link }) => (
        <Card key={title} className="mx-auto my-4 w-11/12 md:m-4 md:w-96">
          <CardHeader title={title} />
          <div className="p-4 pb-0">{description}</div>
          <div className="p-4">
            <ButtonLink href={link} className="link px-1.5">
              SLIDES
            </ButtonLink>
          </div>
        </Card>
      ))}
    </CardContainer>
  </ConsoleSection>
);

const TimelineSection = (
  <ConsoleSection title="dev-sam timeline">
    <div className="timeline-section relative flex flex-row flex-wrap items-center justify-center">
      <div className="timeline-vertical-bar absolute top-8 bottom-36 hidden w-0.5 bg-blue-500 lg:block" />
      {DATASET_TIMELINE.map((item) => (
        <CardContainer key={`${item.title}-${item.time}`} className="mb-4 w-full">
          <div className="mx-auto my-0 flex w-full content-start items-start justify-center">
            <span className="connector-dot mt-6 ml-2 mr-4 hidden h-2 w-2 rounded bg-blue-500 lg:block" />
            <Card className="timeline-card ml-0 w-11/12">
              {item.image != null && <LazyCardMedia image={item.image} title={item.title} />}
              <CardHeader title={item.title} subheader={item.time} />
              {item.detail != null && <div className="p-4 pb-0 last:pb-4">{item.detail}</div>}
              {item.links != null && (
                <div className="p-4">
                  {item.links.map(({ name, url }, index) => (
                    <ButtonLink key={index} href={url} className="px-1.5">
                      {name}
                    </ButtonLink>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </CardContainer>
      ))}
    </div>
  </ConsoleSection>
);

export default function IndexPage(): JSX.Element {
  return (
    <div className="relative mx-auto flex max-w-[1440px] flex-row flex-wrap justify-start lg:flex-nowrap">
      <div className="sidebar flex h-screen w-full flex-wrap items-center lg:sticky lg:top-0">
        <StickyCodeBlock />
      </div>
      <div className="content-block my-12 w-full">
        {AboutSection}
        {ProjectSection}
        {TechTalkSection}
        {TimelineSection}
      </div>
    </div>
  );
}

IndexPage.noJS = true;
