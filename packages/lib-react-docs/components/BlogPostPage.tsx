import React from 'react';

import BlogPostItem from './BlogPostItem';
import BlogPostPaginator from './BlogPostPaginator';
import type { Metadata } from './blog-types';

import HeadTitle from 'esbuild-scripts/components/HeadTitle';
import TOC from 'lib-react-docs/components/TOC';

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
  const { nextItem, prevItem } = metadata;
  const title = BlogPostContents.toc.label;

  return (
    <div className="container margin-vert--lg">
      <HeadTitle title={`${title} | ${siteTitle}`} />
      <div className="row">
        <div className="col col--2" />
        <main className="col col--8">
          <BlogPostItem title={title} metadata={metadata} truncated={BlogPostContents.truncated}>
            <BlogPostContents />
          </BlogPostItem>
          {(nextItem || prevItem) && (
            <div className="margin-vert--xl">
              <BlogPostPaginator nextItem={nextItem} prevItem={prevItem} />
            </div>
          )}
        </main>
        <div className="col col--2">
          <TOC toc={BlogPostContents.toc.children} />
        </div>
      </div>
    </div>
  );
}
