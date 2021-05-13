import React from 'react';

import BlogPostItem from './BlogPostItem';
import type { Content } from './types';

import Head from 'esbuild-scripts/components/Head';

const TITLE = 'Developer Sam Blog';

type Props = { readonly items: readonly { readonly content: Content }[] };

export default function BlogListPage({ items }: Props): JSX.Element {
  return (
    <div className="container margin-vert--lg">
      <Head>
        <title>{TITLE}</title>
        <meta property="og:title" content={TITLE} />
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
        <div className="col col--2" />
      </div>
    </div>
  );
}
