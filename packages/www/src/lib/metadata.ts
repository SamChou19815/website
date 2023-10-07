export type BlogPostMetadata = {
  readonly title: string;
  readonly year: string;
  readonly month: string;
  readonly date: string;
  readonly titleSlug: string;
};

export const allMetadata: readonly BlogPostMetadata[] = JSON.parse(
  process.env.ALL_BLOG_POST_METADATA as string,
);

export function permalinkFromMetadata(metadata: BlogPostMetadata): string {
  return `/blog/${metadata.year}/${metadata.month}/${metadata.date}/${metadata.titleSlug}`;
}
