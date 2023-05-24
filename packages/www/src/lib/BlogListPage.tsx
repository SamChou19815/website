import HeadTitle from "esbuild-scripts/components/HeadTitle";
import { BLOG_TITLE } from "./blog-constants";
import items from "../generator/generated-metadata.mjs";
import BlogDocumentWrapper from "./BlogDocumentWrapper";
import BlogPostItem from "./BlogPostItem";

export default function BlogListPage(): JSX.Element {
  return (
    <BlogDocumentWrapper>
      <HeadTitle title={BLOG_TITLE} />
      <div className="flex flex-row flex-wrap justify-center">
        <main className="w-full">
          {items.map((metadata) => (
            <BlogPostItem key={metadata.permalink} metadata={metadata} truncated={true} />
          ))}
        </main>
      </div>
    </BlogDocumentWrapper>
  );
}
