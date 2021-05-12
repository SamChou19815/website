import Layout from '@theme/Layout';
import React from 'react';

import BlogPostItem from './BlogPostItem';
import BlogPostPaginator from './BlogPostPaginator';
import type { Content } from './types';

import TOC from 'lib-react-toc';

type Props = { readonly content: Content };

export default function BlogPostPage({ content: BlogPostContents }: Props): JSX.Element {
  const { frontMatter, metadata } = BlogPostContents;
  const { title, nextItem, prevItem } = metadata;

  return (
    <Layout title={title}>
      {BlogPostContents && (
        <div className="container margin-vert--lg">
          <div className="row">
            <main className="col col--10">
              <BlogPostItem frontMatter={frontMatter} metadata={metadata} isBlogPostPage>
                <BlogPostContents />
              </BlogPostItem>
              {(nextItem || prevItem) && (
                <div className="margin-vert--xl">
                  <BlogPostPaginator nextItem={nextItem} prevItem={prevItem} />
                </div>
              )}
            </main>
            {BlogPostContents.toc && (
              <div className="col col--2">
                <TOC toc={BlogPostContents.toc} />
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
