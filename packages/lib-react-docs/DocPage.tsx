/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable react/display-name */

import React, { ReactNode, ComponentProps, isValidElement } from 'react';

import DocLayout from './DocLayout';
import DocPaginator from './DocPaginator';
import type { SidebarItem, SidebarItemLink } from './DocSidebar';
import DocTableOfContents from './DocTableOfContents';
import type { MarkdownTablesOfContentsElement } from './markdown-header-parser';

import Head from 'esbuild-scripts/components/Head';
import Link from 'esbuild-scripts/components/Link';
import MDXProvider from 'esbuild-scripts/components/MDXProvider';
import { useLocation } from 'esbuild-scripts/components/router-hooks';
import { checkNotNull } from 'lib-common';
import PrismCodeBlock from 'lib-react-prism/PrismCodeBlock';

import './DocPage.css';

const flattenDocs = (items: readonly SidebarItem[]) => {
  const collector: SidebarItemLink[] = [];

  const visit = (item: SidebarItem) => {
    if (item.type === 'link') {
      collector.push(item);
    } else {
      item.items.forEach(visit);
    }
  };

  items.forEach(visit);
  return collector;
};

const Heading = (Tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'): ((props: Props) => JSX.Element) =>
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

const MDXComponents = {
  code: (props: ComponentProps<'code'>) => <code {...props} />,
  a: ({ href, ...props }: ComponentProps<'a'>) => {
    if (href?.startsWith('http')) {
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      return <a href={href} {...props} />;
    }
    return <Link {...props} to={href ?? ''} />;
  },
  pre: (props: ComponentProps<'pre'>) => {
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

type Props = {
  readonly siteTitle: string;
  readonly sidebar: readonly SidebarItem[];
  readonly toc: readonly MarkdownTablesOfContentsElement[];
  readonly children: ReactNode;
};

const DocPage = ({ siteTitle, sidebar, toc, children }: Props): JSX.Element => {
  const activePath = useLocation().pathname;
  const items = flattenDocs(sidebar);

  const index = items.findIndex((it) => it.href === activePath);
  const item = checkNotNull(items[index]);

  const previous = items[index - 1];
  const next = items[index + 1];

  return (
    <DocLayout sidebar={sidebar} activePath={activePath}>
      <Head>
        <title>
          {item.label} | {siteTitle}
        </title>
      </Head>
      <div className="container padding-vert--lg">
        <div className="row">
          <div className="col">
            <article>
              <MDXProvider components={MDXComponents}>{children}</MDXProvider>
            </article>
            <div className="margin-vert--lg">
              <DocPaginator previous={previous} next={next} />
            </div>
          </div>
          <div className="col col--3">
            <DocTableOfContents toc={toc} hasLink />
          </div>
        </div>
      </div>
    </DocLayout>
  );
};

export default DocPage;
