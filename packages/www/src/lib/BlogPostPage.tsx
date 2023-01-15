import Head from 'esbuild-scripts/components/Head';
import HeadTitle from 'esbuild-scripts/components/HeadTitle';
import { BLOG_TITLE } from './blog-constants';
import BlogDocumentWrapper from './BlogDocumentWrapper';
import BlogPostItem from './BlogPostItem';
import BlogPostPaginator from './BlogPostPaginator';
import generatedMetadata from '../generator/generated-metadata.mjs';

type Props = { readonly content: CompiledMarkdownComponent; readonly permalink: string };

export default function BlogPostPage({ content: BlogPostContents, permalink }: Props): JSX.Element {
  const metadata = generatedMetadata.find((it) => it.permalink === permalink);
  if (metadata == null) {
    throw permalink;
  }
  const ogImage = BlogPostContents?.additionalProperties?.['ogImage'];
  return (
    <BlogDocumentWrapper>
      <HeadTitle title={`${metadata.title} | ${BLOG_TITLE}`} />
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
            <BlogPostPaginator
              nextPermalink={metadata.nextPermalink}
              prevPermalink={metadata.prevPermalink}
            />
          </div>
        </main>
      </div>
    </BlogDocumentWrapper>
  );
}
