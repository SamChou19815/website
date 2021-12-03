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
    <>
      <HeadTitle title={siteTitle} />
      <div className="flex flex-row flex-wrap justify-center">
        <main className="w-full">
          {items.map((metadata) => (
            <BlogPostItem key={metadata.permalink} metadata={metadata} truncated />
          ))}
        </main>
      </div>
    </>
  );
}
