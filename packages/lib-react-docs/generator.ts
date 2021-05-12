import { dirname, extname, join } from 'path';

import type { SidebarItem } from './DocSidebar';
import getMarkdownDocsPageTemplate from './docs-page-template';

import { GENERATED_PAGES_PATH } from 'esbuild-scripts/utils/constants';
import { emptyDirectory, ensureDirectory, readDirectory, readFile, writeFile } from 'lib-fs';
import parseMarkdownHeaderTree from 'lib-markdown-header-parser';

type SimpleSidebarItems = readonly string[] | { readonly [category: string]: SimpleSidebarItems };

type Configuration = { readonly siteTitle: string; readonly sideBarItems: SimpleSidebarItems };

const pathWithoutExtension = (path: string) => path.substring(0, path.lastIndexOf('.'));

const GENERATED_DOCS_PAGE_PATH = join(GENERATED_PAGES_PATH, 'docs');

const generateDocumentation = async ({ siteTitle, sideBarItems }: Configuration) => {
  const docsPaths = (await readDirectory('docs', true)).filter((it) => {
    switch (extname(it)) {
      case '.md':
      case '.mdx':
        return true;
      default:
        return false;
    }
  });
  await ensureDirectory(GENERATED_DOCS_PAGE_PATH);
  await emptyDirectory(GENERATED_DOCS_PAGE_PATH);

  const docsWithTableOfContentItems = await Promise.all(
    docsPaths.map(async (documentPath) => {
      const content = await readFile(join('docs', documentPath));
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
      await ensureDirectory(dirname(generatedPagePath));
      await writeFile(
        generatedPagePath,
        getMarkdownDocsPageTemplate(siteTitle, sideBar, documentPath, tocItem.children)
      );
    })
  );
};

const runnerWithGeneratedMarkdownDocsPages = (configuration: Configuration): void => {
  generateDocumentation(configuration).then(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('esbuild-scripts');
  });
};

export default runnerWithGeneratedMarkdownDocsPages;
