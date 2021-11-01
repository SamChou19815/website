/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare const __SERVER__: boolean;

type MarkdownTablesOfContentsElement = {
  readonly label: string;
  readonly children: readonly MarkdownTablesOfContentsElement[];
};

type CompiledMarkdownComponent = {
  readonly isMDXComponent: true;
  readonly truncated: boolean;
  readonly toc: readonly MarkdownTablesOfContentsElement;
  readonly additionalProperties?: Readonly<Record<string, string>>;
  (): JSX.Element;
};

declare module '*.md' {
  const MarkdownComponent: CompiledMarkdownComponent;
  export default MarkdownComponent;
}

declare module '@mdx-js/react';
