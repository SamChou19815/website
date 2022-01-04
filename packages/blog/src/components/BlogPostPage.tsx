import Head from 'esbuild-scripts/components/Head';
import HeadTitle from 'esbuild-scripts/components/HeadTitle';
import React from 'react';
import type { Metadata } from './blog-types';
import BlogPostItem from './BlogPostItem';
import BlogPostPaginator from './BlogPostPaginator';

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
    <>
      <HeadTitle title={`${title} | ${siteTitle}`} />
      <Head>
        <meta name="twitter:card" content="summary" />
        {ogImage && (
          <meta property="og:image" content={`https://blog.developersam.com${ogImage}`} />
        )}
      </Head>
      <div className="flex flex-row flex-wrap justify-center">
        <main className="w-full">
          <BlogPostItem metadata={metadata} truncated={false}>
            <BlogPostContents />
          </BlogPostItem>
          <div className="my-8">
            <BlogPostPaginator nextItem={nextItem} prevItem={prevItem} />
          </div>
        </main>
      </div>
    </>
  );
}
