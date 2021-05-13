import React from 'react';

import BlogPostItem from './BlogPostItem';
import type { Content } from './blog-types';

import Head from 'esbuild-scripts/components/Head';

type Props = {
  readonly siteTitle: string;
  readonly items: readonly { readonly content: Content }[];
};

export default function BlogListPage({ siteTitle, items }: Props): JSX.Element {
  return (
    <div className="container margin-vert--lg">
      <Head>
        <title>{siteTitle}</title>
        <meta property="og:title" content={siteTitle} />
      </Head>
      <div className="row">
        <div className="col col--2" />
        <main className="col col--8">
          {items.map(({ content: BlogPostContent }) => (
            <BlogPostItem
              key={BlogPostContent.metadata.permalink}
              metadata={BlogPostContent.metadata}
              truncated={BlogPostContent.metadata.truncated}
            >
              <BlogPostContent />
            </BlogPostItem>
          ))}
        </main>
      </div>
    </div>
  );
}
