import React from 'react';

import BlogPostItem from './BlogPostItem';
import BlogPostPaginator from './BlogPostPaginator';
import type { Content } from './blog-types';

import HeadTitle from 'esbuild-scripts/components/HeadTitle';
import TOC from 'lib-react-docs/components/TOC';

type Props = { readonly siteTitle: string; readonly content: Content };

export default function BlogPostPage({ siteTitle, content: BlogPostContents }: Props): JSX.Element {
  const { metadata } = BlogPostContents;
  const { title, nextItem, prevItem } = metadata;

  return (
    <div className="container margin-vert--lg">
      <HeadTitle title={`${title} | ${siteTitle}`} />
      <div className="row">
        <div className="col col--2" />
        <main className="col col--8">
          <BlogPostItem metadata={metadata} isBlogPostPage>
            <BlogPostContents />
          </BlogPostItem>
          {(nextItem || prevItem) && (
            <div className="margin-vert--xl">
              <BlogPostPaginator nextItem={nextItem} prevItem={prevItem} />
            </div>
          )}
        </main>
        <div className="col col--2">
          <TOC toc={BlogPostContents.toc} />
        </div>
      </div>
    </div>
  );
}
