import generatedMetadata from "../generator/generated-metadata.mjs";
import BlogDocumentWrapper from "./BlogDocumentWrapper";
import BlogPostItem from "./BlogPostItem";
import BlogPostPaginator from "./BlogPostPaginator";

type Props = {
  readonly content: CompiledMarkdownComponent;
  readonly permalink: string;
};

export default function BlogPostPage({ content: BlogPostContents, permalink }: Props): JSX.Element {
  const metadata = generatedMetadata.find((it) => it.permalink === permalink);
  if (metadata == null) {
    throw permalink;
  }
  return (
    <BlogDocumentWrapper>
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
