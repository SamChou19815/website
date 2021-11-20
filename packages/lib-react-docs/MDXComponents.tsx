import Link from 'esbuild-scripts/components/Link';
import PrismCodeBlock from 'lib-react-prism/PrismCodeBlock';
import React, { ComponentProps, isValidElement } from 'react';

import './MDXComponents.css';

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type HeadingComponentType = (props: ComponentProps<HeadingTag>) => JSX.Element;

const Heading = (Tag: HeadingTag): HeadingComponentType =>
  function TargetComponent({ id, children, ...props }: ComponentProps<typeof Tag>) {
    if (!id) return <Tag {...props}>{children}</Tag>;

    return (
      <Tag {...props}>
        <a aria-hidden="true" tabIndex={-1} className="anchor" id={id} />
        {children}
        <a className="hash-link" href={`#${id}`} title="Direct link to heading">
          #
        </a>
      </Tag>
    );
  };

type CustomizedMDXComponents = {
  readonly code: (props: ComponentProps<'code'>) => JSX.Element;
  readonly a: (props: ComponentProps<'a'>) => JSX.Element;
  readonly pre: (props: ComponentProps<'pre'>) => JSX.Element;
  readonly h1: HeadingComponentType;
  readonly h2: HeadingComponentType;
  readonly h3: HeadingComponentType;
  readonly h4: HeadingComponentType;
  readonly h5: HeadingComponentType;
  readonly h6: HeadingComponentType;
};

const MDXComponents: CustomizedMDXComponents = {
  code: (props) => <code {...props} />,
  a: ({ href, ...props }) => {
    if (href?.startsWith('http')) {
      return <a href={href} {...props} />;
    }
    return <Link {...props} to={href ?? ''} />;
  },
  pre: (props) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stringOrComponentChildren = props.children as any;
    const { className, children } = (
      isValidElement(stringOrComponentChildren) ? stringOrComponentChildren?.props : props
    ) as { className: string; readonly children: string };
    return (
      <PrismCodeBlock language={className.replace(/language-/, '')}>
        {children.trim()}
      </PrismCodeBlock>
    );
  },
  h1: Heading('h1'),
  h2: Heading('h2'),
  h3: Heading('h3'),
  h4: Heading('h4'),
  h5: Heading('h5'),
  h6: Heading('h6'),
};

export default MDXComponents;
