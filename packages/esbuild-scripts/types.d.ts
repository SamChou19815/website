declare const __SERVER__: boolean;

declare module '*.md' {
  export default function MarkdownComponent(): JSX.Element;
}

declare module '*.mdx' {
  export default function MarkdownComponent(): JSX.Element;
}

declare module '@mdx-js/react';
