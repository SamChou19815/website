/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare const __SERVER__: boolean;

type CompiledMarkdownComponent = {
  readonly isMDXComponent: true;
  readonly additionalProperties?: Readonly<Record<string, string>>;
  (): JSX.Element;
};

declare module '*.md' {
  const MarkdownComponent: CompiledMarkdownComponent;
  export default MarkdownComponent;
}
