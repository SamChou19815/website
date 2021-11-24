import HeadTitle from 'esbuild-scripts/components/HeadTitle';
import React from 'react';

import BlogPostItem from './BlogPostItem';
import type { Metadata } from './blog-types';

type Props = {
  readonly siteTitle: string;
  readonly items: readonly Metadata[];
};

export default function BlogListPage({ siteTitle, items }: Props): JSX.Element {
  return (
    <div className="container margin-vert--lg">
      <HeadTitle title={siteTitle} />
      <div className="row">
        <div className="col col--2" />
        <main className="col col--8">
          {items.map((metadata) => (
            <BlogPostItem key={metadata.permalink} metadata={metadata} truncated />
          ))}
        </main>
      </div>
    </div>
  );
}
