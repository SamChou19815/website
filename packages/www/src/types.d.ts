type BlogPostMetadata = {
  readonly title: string;
  readonly formattedDate: string;
  readonly permalink: string;
  readonly year: string;
  readonly month: string;
  readonly date: string;
  readonly titleSlug: string;
  readonly nextPermalink?: string;
  readonly prevPermalink?: string;
};

type CompiledMarkdownComponent = {
  readonly isMDXComponent: true;
  (): JSX.Element;
};

declare module "*.mdx" {
  const MarkdownComponent: CompiledMarkdownComponent;
  export const title: string;
  export const ogImage: string | undefined;
  export default MarkdownComponent;
}
