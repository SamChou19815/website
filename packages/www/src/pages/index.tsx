import ButtonLink from '../components/ButtonLink';
import Card from '../components/Card';
import CardContainer from '../components/CardContainer';
import CardHeader from '../components/CardHeader';
import ConsoleSection from '../components/ConsoleSection';
import { DATASET_TIMELINE } from '../components/data';
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
        <div className="m-2 flex w-40 content-center items-center">
          <WwwSvgIcon iconName="work" />
          <span className="ml-2">Facebook SWE</span>
        </div>
        <div className="m-2 flex w-40 content-center items-center">
          <WwwSvgIcon iconName="github" />
          <span className="ml-2">OSS Contributor</span>
        </div>
        <div className="m-2 flex w-40 content-center items-center">
          <WwwSvgIcon iconName="school" />
          <span className="ml-2">Cornell University</span>
        </div>
        <div className="m-2 flex w-40 content-center items-center">
          <WwwSvgIcon iconName="code" />
          <span className="ml-2">Coding since 13</span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex flex-grow justify-evenly">
          <ButtonLink href="https://blog.developersam.com" className="px-1.5">
            Blog
          </ButtonLink>
          <ButtonLink href="https://github.com/SamChou19815" className="px-1.5">
            GitHub
          </ButtonLink>
          <ButtonLink href="/resume.pdf" className="px-1.5">
            Resume
          </ButtonLink>
        </div>
      </div>
    </Card>
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
        {TimelineSection}
      </div>
    </div>
  );
}

IndexPage.noJS = true;
