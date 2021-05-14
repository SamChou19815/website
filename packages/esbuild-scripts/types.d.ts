declare const __SERVER__: boolean;

type MarkdownTablesOfContentsElement = {
  readonly label: string;
  readonly children: readonly MarkdownTablesOfContentsElement[];
};

type CompiledMarkdownComponent = {
  readonly isMDXComponent: true;
  readonly truncated: boolean;
  readonly toc: readonly MarkdownTablesOfContentsElement;
  (): JSX.Element;
};

declare module '*.md' {
  const MarkdownComponent: CompiledMarkdownComponent;
  export default MarkdownComponent;
}

declare module '*.mdx' {
  export default function MarkdownComponent(): JSX.Element;
}

declare module '@mdx-js/react';
