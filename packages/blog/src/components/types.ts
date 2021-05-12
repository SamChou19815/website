import type { MarkdownTablesOfContentsElement } from 'lib-markdown-header-parser';

export type FrontMatter = { readonly title: string };

export type Metadata = {
  readonly title: string;
  readonly date: string;
  readonly formattedDate: string;
  readonly permalink: string;
  readonly truncated?: string;
  readonly nextItem?: { readonly title: string; readonly permalink: string };
  readonly prevItem?: { readonly title: string; readonly permalink: string };
};

export type Content = {
  readonly frontMatter: FrontMatter;
  readonly metadata: Metadata;
  readonly toc: readonly MarkdownTablesOfContentsElement[];
  (): JSX.Element;
};
