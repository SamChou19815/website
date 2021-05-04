import React, { ReactNode } from 'react';

import DocLayout from './DocLayout';
import DocPaginator from './DocPaginator';
import type { SidebarItem, SidebarItemLink } from './DocSidebar';
import DocTableOfContents from './DocTableOfContents';
import type { MarkdownTablesOfContentsElement } from './markdown-header-parser';

import Head from 'esbuild-scripts/components/Head';
import { useLocation } from 'esbuild-scripts/components/router-hooks';

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
  const item = items[index];
  if (item == null) {
    return (
      <DocLayout sidebar={sidebar} activePath={activePath}>
        <Head>
          <title>Docs | {siteTitle}</title>
        </Head>
        <div className="container padding-vert--lg">
          <div className="row">
            <div className="col">
              <article>{children}</article>
            </div>
            <div className="col col--3">
              <DocTableOfContents toc={toc} hasLink={false} />
            </div>
          </div>
        </div>
      </DocLayout>
    );
  }

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
            <article>{children}</article>
          </div>
          <div className="col col--3">
            <DocTableOfContents toc={toc} hasLink={false} />
          </div>
        </div>
        <div className="margin-vert--lg">
          <DocPaginator previous={previous} next={next} />
        </div>
      </div>
    </DocLayout>
  );
};

export default DocPage;
