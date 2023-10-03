import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { type ComponentProps, isValidElement } from "react";
import StaticCodeBlock from "./lib/StaticCodeBlock";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type HeadingComponentType = (props: ComponentProps<HeadingTag>) => JSX.Element;

const Heading = (Tag: HeadingTag): HeadingComponentType =>
  function TargetComponent({ id, children, ...props }: ComponentProps<typeof Tag>) {
    return <Tag {...props}>{children}</Tag>;
  };

const CustomMDXComponents: MDXComponents = {
  code: (props) => <code {...props} />,
  a: ({ href, ...props }) => {
    if (href?.startsWith("http")) {
      return <a href={href} {...props} />;
    }
    return <Link href={href || ""} />;
  },
  pre: (props) => {
    // biome-ignore lint/suspicious/noExplicitAny: shameful children inspection
    const stringOrComponentChildren = props.children as any;
    const { className, children } = (
      isValidElement(stringOrComponentChildren) ? stringOrComponentChildren?.props : props
    ) as { className: string; readonly children: string };
    return (
      <StaticCodeBlock language={className.replace(/language-/, "")} className="text-sm">
        {children.trim()}
      </StaticCodeBlock>
    );
  },
  ul: ({ children, ...props }) => (
    <ul className="list-inside list-disc" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="list-inside list-decimal" {...props}>
      {children}
    </ol>
  ),
  h1: Heading("h1"),
  h2: Heading("h2"),
  h3: Heading("h3"),
  h4: Heading("h4"),
  h5: Heading("h5"),
  h6: Heading("h6"),
};

// This file is required to use MDX in `app` directory.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    ...CustomMDXComponents,
  };
}
