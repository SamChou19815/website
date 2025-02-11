type CompiledMarkdownComponent = {
  readonly isMDXComponent: true;
  (): React.JSX.Element;
};

declare module "*.mdx" {
  const MarkdownComponent: CompiledMarkdownComponent;
  export const title: string;
  export default MarkdownComponent;
}
