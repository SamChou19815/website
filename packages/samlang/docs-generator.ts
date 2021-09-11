import { extname, join, resolve } from 'path';

import mainRunner, { utils } from 'esbuild-scripts/api';

import type { SidebarItem } from './src/components/DocSidebar';
import { SAMLANG_TITLE, SAMLANG_SIDEBAR_ITEMS } from './src/constants';

type SimpleSidebarItems = readonly string[] | { readonly [category: string]: SimpleSidebarItems };

const BLOG_DOC_PAGE_COMPONENT_PATH = resolve(join('src', 'components', 'DocPage'));

const pathWithoutExtension = (path: string) => path.substring(0, path.lastIndexOf('.'));

function getMarkdownDocsPageTemplate(
  absoluteProjectRoot: string,
  sidebar: readonly SidebarItem[],
  markdownPath: string
): string {
  return `// ${'@'}generated
import React from 'react';
import DocPage from '${BLOG_DOC_PAGE_COMPONENT_PATH}';
import Content from '${absoluteProjectRoot}/docs/${markdownPath}';

const DocumentPage = () => (
  <DocPage
    siteTitle={\`${SAMLANG_TITLE}\`}
    sidebar={${JSON.stringify(sidebar)}}
    content={Content}
  >
    <Content />
  </DocPage>
);
export default DocumentPage;
`;
}

mainRunner(async () => {
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
  const sideBar = expandSideBar(SAMLANG_SIDEBAR_ITEMS);

  const absoluteProjectRoot = resolve('.');
  return Object.fromEntries(
    docsWithTitles.map(({ documentPath }) => {
      return [
        `docs/${pathWithoutExtension(documentPath)}`,
        getMarkdownDocsPageTemplate(absoluteProjectRoot, sideBar, documentPath),
      ];
    })
  );
});
