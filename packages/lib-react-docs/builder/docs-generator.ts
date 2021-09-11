import { extname, join, resolve } from 'path';

import { utils } from 'esbuild-scripts/api';

import type { SidebarItem } from '../components/DocSidebar';

type SimpleSidebarItems = readonly string[] | { readonly [category: string]: SimpleSidebarItems };

export type DocsSiteConfiguration = {
  readonly siteTitle: string;
  readonly sideBarItems: SimpleSidebarItems;
};

const pathWithoutExtension = (path: string) => path.substring(0, path.lastIndexOf('.'));

function getMarkdownDocsPageTemplate(
  absoluteProjectRoot: string,
  siteTitle: string,
  sidebar: readonly SidebarItem[],
  markdownPath: string
): string {
  return `// ${'@'}generated
import React from 'react';
import DocPage from 'lib-react-docs/components/DocPage';
import Content from '${absoluteProjectRoot}/docs/${markdownPath}';

const DocumentPage = () => (
  <DocPage
    siteTitle={\`${siteTitle}\`}
    sidebar={${JSON.stringify(sidebar)}}
    content={Content}
  >
    <Content />
  </DocPage>
);
export default DocumentPage;
`;
}

export default async function generateDocumentationVirtualEntryComponents({
  siteTitle,
  sideBarItems,
}: DocsSiteConfiguration): Promise<Readonly<Record<string, string>>> {
  const docsPaths = (await utils.readDirectory('docs', true)).filter((it) => extname(it) === '.md');

  const docsWithTitles = await Promise.all(
    docsPaths.map(async (documentPath) => ({
      documentPath,
      title: utils.parseMarkdownTitle(await utils.readFile(join('docs', documentPath))),
    }))
  );

  const expandSideBar = (items: SimpleSidebarItems): SidebarItem[] => {
    if (Array.isArray(items)) {
      return items.map((item: string) => {
        const relevantDocs = docsWithTitles.find(
          ({ documentPath }) => `/${pathWithoutExtension(documentPath)}` === item
        );
        if (relevantDocs == null) {
          throw new Error(`No document with href ${item} found on disk.`);
        }
        return { type: 'link', href: `/docs${item}`, label: relevantDocs.title };
      });
    }
    return Object.entries(items).map(([label, nested]) => ({
      type: 'category',
      label,
      items: expandSideBar(nested),
    }));
  };
  const sideBar = expandSideBar(sideBarItems);

  const absoluteProjectRoot = resolve('.');
  return Object.fromEntries(
    docsWithTitles.map(({ documentPath }) => {
      return [
        `docs/${pathWithoutExtension(documentPath)}`,
        getMarkdownDocsPageTemplate(absoluteProjectRoot, siteTitle, sideBar, documentPath),
      ];
    })
  );
}
