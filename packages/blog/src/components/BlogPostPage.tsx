import Head from 'esbuild-scripts/components/Head';
import HeadTitle from 'esbuild-scripts/components/HeadTitle';
import React from 'react';

import BlogPostItem from './BlogPostItem';
import BlogPostPaginator from './BlogPostPaginator';
import type { Metadata } from './blog-types';

type Props = {
  readonly siteTitle: string;
  readonly content: CompiledMarkdownComponent;
  readonly metadata: Metadata;
};

export default function BlogPostPage({
  siteTitle,
  content: BlogPostContents,
  metadata,
}: Props): JSX.Element {
  const { title, nextItem, prevItem } = metadata;
  const ogImage = BlogPostContents?.additionalProperties?.['ogImage'];

  return (
    <div className="container margin-vert--lg">
      <HeadTitle title={`${title} | ${siteTitle}`} />
      {ogImage && (
        <Head>
          <meta property="og:image" content={`https://blog.developersam.com${ogImage}`} />
        </Head>
      )}
      <div className="row">
        <div className="col col--2" />
        <main className="col col--8">
          <BlogPostItem metadata={metadata} truncated={false}>
            <BlogPostContents />
          </BlogPostItem>
          {(nextItem || prevItem) && (
            <div className="margin-vert--xl">
              <BlogPostPaginator nextItem={nextItem} prevItem={prevItem} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
