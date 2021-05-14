import { dirname, extname, join } from 'path';

import type { SidebarItem } from '../components/DocSidebar';
import parseMarkdownHeaderTree, {
  MarkdownTablesOfContentsElement,
} from '../utils/markdown-header-parser';

import { constants, utils } from 'esbuild-scripts/api';

type SimpleSidebarItems = readonly string[] | { readonly [category: string]: SimpleSidebarItems };

export type DocsSiteConfiguration = {
  readonly siteTitle: string;
  readonly sideBarItems: SimpleSidebarItems;
};

const pathWithoutExtension = (path: string) => path.substring(0, path.lastIndexOf('.'));

const GENERATED_DOCS_PAGE_PATH = join(constants.GENERATED_PAGES_PATH, 'docs');

const getMarkdownDocsPageTemplate = (
  siteTitle: string,
  sidebar: readonly SidebarItem[],
  markdownPath: string,
  toc: readonly MarkdownTablesOfContentsElement[]
): string => {
  return `// ${'@'}generated
import React from 'react';
import DocPage from 'lib-react-docs/components/DocPage';
import Content from 'esbuild-scripts-internal/docs/${markdownPath}';

const DocumentPage = () => (
  <DocPage
    siteTitle={\`${siteTitle}\`}
    sidebar={${JSON.stringify(sidebar)}}
    toc={${JSON.stringify(toc)}}
  >
    <Content />
  </DocPage>
);
export default DocumentPage;
`;
};

const generateDocumentation = async ({
  siteTitle,
  sideBarItems,
}: DocsSiteConfiguration): Promise<void> => {
  const docsPaths = (await utils.readDirectory('docs', true)).filter((it) => {
    switch (extname(it)) {
      case '.md':
      case '.mdx':
        return true;
      default:
        return false;
    }
  });
  await utils.ensureDirectory(GENERATED_DOCS_PAGE_PATH);
  await utils.emptyDirectory(GENERATED_DOCS_PAGE_PATH);

  const docsWithTableOfContentItems = await Promise.all(
    docsPaths.map(async (documentPath) => {
      const content = await utils.readFile(join('docs', documentPath));
      return {
        documentPath,
        content,
        tocItem: parseMarkdownHeaderTree(content),
      };
    })
  );

  const expandSideBar = (items: SimpleSidebarItems): SidebarItem[] => {
    if (Array.isArray(items)) {
      return items.map((item: string) => {
        const relevantDocs = docsWithTableOfContentItems.find(
          ({ documentPath }) => `/${pathWithoutExtension(documentPath)}` === item
        );
        if (relevantDocs == null) {
          throw new Error(`No document with href ${item} found on disk.`);
        }
        return {
          type: 'link',
          href: `/docs${item}`,
          label: relevantDocs.tocItem.label,
        };
      });
    }
    return Object.entries(items).map(([label, nested]) => ({
      type: 'category',
      label,
      items: expandSideBar(nested),
    }));
  };
  const sideBar = expandSideBar(sideBarItems);

  await Promise.all(
    docsWithTableOfContentItems.map(async ({ documentPath, tocItem }) => {
      const generatedPagePath = join(
        GENERATED_DOCS_PAGE_PATH,
        `${pathWithoutExtension(documentPath)}.jsx`
      );
      await utils.ensureDirectory(dirname(generatedPagePath));
      await utils.writeFile(
        generatedPagePath,
        getMarkdownDocsPageTemplate(siteTitle, sideBar, documentPath, tocItem.children)
      );
    })
  );
};

export default generateDocumentation;
