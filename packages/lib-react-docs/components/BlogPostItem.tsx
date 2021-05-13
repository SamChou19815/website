import React from 'react';

import MDXComponents from './MDXComponents';
import type { Metadata } from './blog-types';

import Link from 'esbuild-scripts/components/Link';
import MDXProvider from 'esbuild-scripts/components/MDXProvider';

type Props = {
  readonly metadata: Metadata;
  readonly truncated?: string | boolean;
  readonly isBlogPostPage?: boolean;
  readonly children: JSX.Element;
};

export default function BlogPostItem(props: Props): JSX.Element {
  const { children, metadata, truncated, isBlogPostPage = false } = props;
  const { title, date, formattedDate, permalink } = metadata;

  const TitleHeading = isBlogPostPage ? 'h1' : 'h2';

  return (
    <>
      <article className={!isBlogPostPage ? 'margin-bottom--xl' : undefined}>
        <header>
          <TitleHeading className="margin-bottom--sm blog-post-title">
            {isBlogPostPage ? title : <Link to={permalink}>{title}</Link>}
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
