/// <reference types="esbuild-scripts" />

type BlogPostMetadata = {
  readonly title: string;
  readonly formattedDate: string;
  readonly permalink: string;
  readonly nextPermalink?: string;
  readonly prevPermalink?: string;
};
