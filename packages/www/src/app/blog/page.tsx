import type { Metadata } from "next";
import items from "../../generator/generated-metadata.mjs";
import BlogDocumentWrapper from "../../lib/BlogDocumentWrapper";
import BlogPostItem from "../../lib/BlogPostItem";
import { BLOG_TITLE } from "../../lib/blog-constants.mjs";

export const metadata: Metadata = {
  title: BLOG_TITLE,
  description: "Developer Sam's Blog",
  authors: { name: "Developer Sam" },
  openGraph: {
    images: "https://developersam.com/sam-by-megan-3-square.webp",
    type: "profile",
    title: BLOG_TITLE,
    description: "Developer Sam's Blog",
  },
};

export default function BlogListPage(): JSX.Element {
  return (
    <BlogDocumentWrapper>
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
