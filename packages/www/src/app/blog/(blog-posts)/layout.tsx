import BlogDocumentWrapper from "../../../lib/BlogDocumentWrapper";
import BlogPostItemContextAware from "../../../lib/BlogPostItemContextAware";

export default function BlogPostPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <BlogDocumentWrapper>
      <div className="flex flex-row flex-wrap justify-center">
        <main className="w-full">
          <BlogPostItemContextAware>{children}</BlogPostItemContextAware>
        </main>
      </div>
    </BlogDocumentWrapper>
  );
}
