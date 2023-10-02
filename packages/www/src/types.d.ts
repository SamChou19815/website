type BlogPostMetadata = {
  readonly title: string;
  readonly formattedDate: string;
  readonly permalink: string;
  readonly nextPermalink?: string;
  readonly prevPermalink?: string;
};

type CompiledMarkdownComponent = {
  readonly isMDXComponent: true;
  readonly additionalProperties?: Readonly<Record<string, string>>;
  (): JSX.Element;
};

declare module "*.md" {
  const MarkdownComponent: CompiledMarkdownComponent;
  export default MarkdownComponent;
}
