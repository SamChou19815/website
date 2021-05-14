import React from 'react';

import MDXComponents from './MDXComponents';
import type { Metadata } from './blog-types';

import Link from 'esbuild-scripts/components/Link';
import MDXProvider from 'esbuild-scripts/components/MDXProvider';

type Props = {
  readonly title: string;
  readonly metadata: Metadata;
  readonly truncated: boolean;
  readonly children: JSX.Element;
};

export default function BlogPostItem(props: Props): JSX.Element {
  const { children, title, metadata, truncated } = props;
  const { date, formattedDate, permalink } = metadata;

  const TitleHeading = truncated ? 'h2' : 'h1';

  return (
    <>
      <article className={truncated ? 'margin-bottom--xl' : undefined}>
        <header>
          <TitleHeading className="margin-bottom--sm blog-post-title">
            {truncated ? <Link to={permalink}>{title}</Link> : title}
          </TitleHeading>
          <div className="margin-vert--md">
            <time dateTime={date} className="blog-post-date">
              {formattedDate}
            </time>
          </div>
        </header>
        <div className="markdown">
          <MDXProvider components={MDXComponents}>{children}</MDXProvider>
        </div>
        {truncated && (
          <footer className="row margin-vert--lg">
            {truncated && (
              <div className="col text--right">
                <Link to={metadata.permalink} aria-label={`Read more about ${title}`}>
                  <strong>Read More</strong>
                </Link>
              </div>
            )}
          </footer>
        )}
      </article>
    </>
  );
}
