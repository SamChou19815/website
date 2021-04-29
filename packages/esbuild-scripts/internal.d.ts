declare module '@mdx-js/react';

declare module '@mdx-js/mdx' {
  export default function mdx(source: string): Promise<string>;
}
