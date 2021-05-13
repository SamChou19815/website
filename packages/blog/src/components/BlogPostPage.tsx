import React from 'react';

import BlogPostItem from './BlogPostItem';
import BlogPostPaginator from './BlogPostPaginator';
import type { Content } from './types';

import Head from 'esbuild-scripts/components/Head';
import TOC from 'lib-react-toc';

type Props = { readonly content: Content };

export default function BlogPostPage({ content: BlogPostContents }: Props): JSX.Element {
  const { metadata } = BlogPostContents;
  const { title, nextItem, prevItem } = metadata;

  const pageTitle = `${title} | Developer Sam Blog`;

  return (
    <div className="container margin-vert--lg">
      <Head>
        <title>{pageTitle}</title>
        <meta property="og:title" content={pageTitle} />
      </Head>
      <div className="row">
        <main className="col col--9">
          <BlogPostItem metadata={metadata} isBlogPostPage>
            <BlogPostContents />
          </BlogPostItem>
          {(nextItem || prevItem) && (
            <div className="margin-vert--xl">
              <BlogPostPaginator nextItem={nextItem} prevItem={prevItem} />
            </div>
          )}
        </main>
        <div className="col col--3">
          <TOC toc={BlogPostContents.toc} />
        </div>
      </div>
    </div>
  );
}
