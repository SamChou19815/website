import type { Metadata } from "next";
import BlogDocumentWrapper from "../../lib/BlogDocumentWrapper";
import BlogPostItem from "../../lib/BlogPostItem";
import { BLOG_TITLE } from "../../lib/blog-constants.mjs";
import allMetadata from "../../lib/metadata";

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

export default async function BlogListPage(): Promise<JSX.Element> {
  return (
    <BlogDocumentWrapper>
      <div className="flex flex-row flex-wrap justify-center">
        <main className="w-full">
          {allMetadata.map((metadata) => (
            <BlogPostItem key={metadata.permalink} metadata={metadata} truncated={true} />
          ))}
        </main>
      </div>
    </BlogDocumentWrapper>
  );
}
