import BlogDocumentWrapper from "../../../../../../lib/BlogDocumentWrapper";
import BlogPostItem from "../../../../../../lib/BlogPostItem";
import BlogPostPaginator from "../../../../../../lib/BlogPostPaginator";
import allMetadata from "../../../../../../lib/metadata";
import type { BlogPostPageParams } from "./page";

export default function BlogPostPageLayout({
  children,
  params,
}: { children: React.ReactNode; params: BlogPostPageParams }) {
  const permalink = `/blog/${params.year}/${params.month}/${params.date}/${params.titleSlug}`;
  const metadata = allMetadata.find((it) => it.permalink === permalink);
  if (metadata == null) {
    throw permalink;
  }

  return (
    <BlogDocumentWrapper>
      <div className="flex flex-row flex-wrap justify-center">
        <main className="w-full">
          <BlogPostItem metadata={metadata} truncated={false}>
            {children}
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
