declare module '@mdx-js/mdx' {
  export default function mdx(source: string, options?: unknown): Promise<string>;
}

declare module 'remark-slug';
