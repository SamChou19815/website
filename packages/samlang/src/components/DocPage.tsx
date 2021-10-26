import HeadTitle from 'esbuild-scripts/components/HeadTitle';
import MDXProvider from 'esbuild-scripts/components/MDXProvider';
import MDXComponents from 'lib-react-docs/MDXComponents';
import TOC from 'lib-react-docs/TOC';
import useActivePath from 'lib-react-docs/useActivePath';
import React from 'react';

import DocLayout from './DocLayout';
import DocPaginator from './DocPaginator';
import type { SidebarItem, SidebarItemLink } from './DocSidebar';

function flattenDocs(items: readonly SidebarItem[]) {
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
}

type Props = {
  readonly siteTitle: string;
  readonly sidebar: readonly SidebarItem[];
  readonly content: CompiledMarkdownComponent;
};

export default function DocPage({ siteTitle, sidebar, content: Content }: Props): JSX.Element {
  const activePath = useActivePath();
  const items = flattenDocs(sidebar);

  const index = items.findIndex((it) => it.href === activePath);
  const item = items[index];
  if (item == null) throw new Error();

  const previous = items[index - 1];
  const next = items[index + 1];

  return (
    <DocLayout sidebar={sidebar} activePath={activePath}>
      <HeadTitle title={`${item.label} | ${siteTitle}`} />
      <div className="container padding-vert--lg">
        <div className="row">
          <div className="col">
            <article>
              <h1>{Content.toc.label}</h1>
              <MDXProvider components={MDXComponents}>
                <Content />
              </MDXProvider>
            </article>
            <div className="margin-vert--lg">
              <DocPaginator previous={previous} next={next} />
            </div>
          </div>
          <div className="col col--3">
            <TOC toc={Content.toc.children} hasLink />
          </div>
        </div>
      </div>
    </DocLayout>
  );
}
