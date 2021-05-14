import type { MarkdownTablesOfContentsElement } from '../utils/markdown-header-parser';

export type BlogPaginationItem = { readonly title: string; readonly permalink: string };

export type Metadata = {
  readonly title: string;
  readonly date: string;
  readonly formattedDate: string;
  readonly permalink: string;
  readonly truncated: boolean;
  readonly nextItem?: BlogPaginationItem;
  readonly prevItem?: BlogPaginationItem;
};

export type Content = {
  readonly metadata: Metadata;
  readonly toc: readonly MarkdownTablesOfContentsElement[];
  (): JSX.Element;
};