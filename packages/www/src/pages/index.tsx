import type { ReactNode } from "react";
import CommonHeader from "esbuild-scripts/components/CommonHeader";
import Link from "esbuild-scripts/components/Link";
import PrismCodeBlock from "lib-react-prism/PrismCodeBlock";
import { DATASET_TIMELINE } from "../lib/home-timeline-data";
import NavBar from "../lib/NavBar";

function LazyCardMedia({ image, title }: { image: string; title: string }): JSX.Element {
  return <img src={image} alt={title} title={title} loading="lazy" />;
}

function ButtonLink({
  href,
  children,
  className,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}): JSX.Element {
  const classes = [
    "button bg-transparent border-0 cursor-pointer px-6 py-1.5 font-bold text-sm text-center",
    "hover:bg-blue-500 hover:bg-opacity-10",
  ];
  if (className != null) {
    classes.push(className);
  }
  return (
    <Link className={classes.join(" ")} to={href}>
      {typeof children === "string" ? children.toLocaleUpperCase() : children}
    </Link>
  );
}

function Card({ className, children }: { className?: string; children: ReactNode }): JSX.Element {
  const CardBaseCSS = "flex flex-col bg-white rounded filter drop-shadow";
  const classes = className != null ? `${CardBaseCSS} ${className}` : CardBaseCSS;
  return <div className={classes}>{children}</div>;
}

function CardHeader({ title, subheader }: { title: string; subheader?: string }): JSX.Element {
  return (
    <div className="px-4 pb-0 last:pb-4">
      <h4 className="mb-0">{title}</h4>
      {subheader && <small>{subheader}</small>}
    </div>
  );
}

function CardContainer({
  className,
  children,
}: { className?: string; children: ReactNode }): JSX.Element {
  const CardContainerBaseCSS = "flex flex-row flex-wrap justify-center max-w-7xl mx-auto";
  const classes = className != null ? `${CardContainerBaseCSS} ${className}` : CardContainerBaseCSS;
  return <div className={classes}>{children}</div>;
}

function StickyCodeBlock(): JSX.Element {
  const code = `
class Pair<A, B>(val a: A, val b: B)
class List<T>(Nil(unit), Cons(Pair<T, List<T>>)) {
  function <T> of(t: T): List<T> =
    List.Cons(Pair.init(t, List.Nil<T>({})))
  method cons(t: T): List<T> =
    List.Cons(Pair.init(t, this))
}
class Developer(
  val github: string,
  val projects: List<string>,
) {
  function sam(): Developer = {
    val github = "SamChou19815";
    val projects = List.of("samlang").cons("...");
    Developer.init(github, projects)
  }
}
class Main {
  function main(): Developer = Developer.sam()
}`;
  return (
    <PrismCodeBlock
      language="samlang"
      className="mx-auto my-0 text-xs leading-5 sm:text-sm"
      manualSection={
        <>
          <div className="token-line">
            <span className="token comment">/**</span>
          </div>
          <div className="token-line">
            <span className="token comment">
              {" "}
              * Copyright (C) 2015-{new Date().getFullYear()} Developer Sam.
            </span>
          </div>
          <div className="token-line">
            <span className="token comment">
              {" * @demo "}
              <a
                className="text-[var(--prism-code-block-comment-color)] underline"
                href="https://samlang.io/demo"
              >
                https://samlang.io/demo
              </a>
            </span>
          </div>
          <div className="token-line">
            <span className="token comment">
              {" * @github "}
              <a
                className="text-[var(--prism-code-block-comment-color)] underline"
                href="https://github.com/SamChou19815"
              >
                https://github.com/SamChou19815
              </a>
            </span>
          </div>
          <div className="token-line">
            <span className="token comment">
              {" * @threads "}
              <a
                className="text-[var(--prism-code-block-comment-color)] underline"
                href="https://www.threads.net/@samzhou19815"
              >
                https://www.threads.net/@samzhou19815
              </a>
            </span>
          </div>
          <div className="token-line">
            <span className="token comment">
              {" "}
              * @resume{" "}
              <a
                className="text-[var(--prism-code-block-comment-color)] underline"
                href="https://developersam.com/resume.pdf"
              >
                https://developersam.com/resume.pdf
              </a>
            </span>
          </div>
          <div className="token-line">
            <span className="token comment">
              {" "}
              * @contact{" "}
              <a
                className="text-[var(--prism-code-block-comment-color)] underline"
                href="https://forms.gle/WtvV8YaBvMk7Fe3b8"
              >
                https://forms.gle/WtvV8YaBvMk7Fe3b8
              </a>
            </span>
          </div>
          <div className="token-line">
            <span className="token comment"> */</span>
          </div>
        </>
      }
    >
      {code}
    </PrismCodeBlock>
  );
}

const TimelineSection = (
  <section>
    <div className="relative flex flex-row flex-wrap items-center justify-center">
      <div className="lg:left-[calc(50%-255px)] absolute top-8 bottom-36 hidden w-0.5 bg-blue-500 lg:block" />
      {DATASET_TIMELINE.map((item) => (
        <CardContainer key={`${item.title}-${item.time}`} className="mb-4 w-full">
          <div className="mx-auto my-0 flex w-full content-start items-start justify-center">
            <span className="connector-dot mt-6 ml-2 mr-4 hidden h-2 w-2 rounded bg-blue-500 lg:block" />
            <Card className="lg:w-[500px] ml-0 w-11/12">
              {item.image != null && <LazyCardMedia image={item.image} title={item.title} />}
              <CardHeader title={item.title} subheader={item.time} />
              {item.detail != null && <div className="p-4 pb-0 last:pb-4">{item.detail}</div>}
              {item.links != null && (
                <div className="p-4">
                  {item.links.map(({ name, url }, index) => (
                    // rome-ignore lint/suspicious/noArrayIndexKey: <explanation>
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
  </section>
);

export default function IndexPage(): JSX.Element {
  return (
    <>
      <CommonHeader
        title="Developer Sam"
        description="Explore the portfolio and projects created and open sourced by Developer Sam."
        shortcutIcon="/favicon.ico"
        htmlLang="en"
        themeColor="#F7F7F7"
        ogAuthor="Developer Sam"
        ogKeywords="Sam, Developer Sam, developer, web apps, open source"
        ogType="profile"
        ogURL="https://developersam.com/"
        ogImage="https://developersam.com/sam-by-megan-3-square.webp"
        gaId="G-K50MLQ68K6"
      >
        <link rel="canonical" href="https://developersam.com/" />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto+Mono:400,500&display=swap"
        />
        <script type="application/ld+json">
          {`{"@context":"http://schema.org","@type":"Organization","url":"https://developersam.com","logo":"https://developersam.com/logo.png"}`}
        </script>
        <script type="application/ld+json">
          {`{"@context":"http://schema.org","@type":"Person","name":"Developer Sam","url":"https://developersam.com","sameAs":[
  "https://www.developersam.com",
  "https://blog.developersam.com",
  "https://www.facebook.com/SamChou19815",
  "https://twitter.com/SamChou19815",
  "https://github.com/SamChou19815",
  "https://www.linkedin.com/in/sam-zhou-30b91610b/"]}`}
        </script>
      </CommonHeader>
      <NavBar title="Developer Sam" titleLink="/" navItems={[{ name: "Blog", link: "/blog" }]} />
      <div className="relative mx-auto flex max-w-7xl flex-row flex-wrap justify-start lg:flex-nowrap">
        <div className="lg:w-[550px] flex h-[calc(100vh-8rem)] w-full flex-wrap items-center lg:sticky lg:top-0">
          <StickyCodeBlock />
        </div>
        <div className="my-12">{TimelineSection}</div>
      </div>
    </>
  );
}
