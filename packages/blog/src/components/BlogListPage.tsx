import HeadTitle from 'esbuild-scripts/components/HeadTitle';
import React from 'react';
import { BLOG_TITLE } from '../constants';
import items from '../generator/generated-metadata.mjs';
import BlogPostItem from './BlogPostItem';

export default function BlogListPage(): JSX.Element {
  return (
    <>
      <HeadTitle title={BLOG_TITLE} />
      <div className="flex flex-row flex-wrap justify-center">
        <main className="w-full">
          {items.map((metadata) => (
            <BlogPostItem key={metadata.permalink} metadata={metadata} truncated={true} />
          ))}
        </main>
      </div>
    </>
  );
}
