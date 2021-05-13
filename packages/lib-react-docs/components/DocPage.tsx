/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable react/display-name */

import React, { ReactNode } from 'react';

import type { MarkdownTablesOfContentsElement } from '../utils/markdown-header-parser';
import DocLayout from './DocLayout';
import DocPaginator from './DocPaginator';
import type { SidebarItem, SidebarItemLink } from './DocSidebar';
import MDXComponents from './MDXComponents';

import Head from 'esbuild-scripts/components/Head';
import MDXProvider from 'esbuild-scripts/components/MDXProvider';
import { useLocation } from 'esbuild-scripts/components/router-hooks';
import { checkNotNull } from 'lib-common';
import TOC from 'lib-react-docs/components/TOC';

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
            <TOC toc={toc} hasLink />
          </div>
        </div>
      </div>
    </DocLayout>
  );
};

export default DocPage;
