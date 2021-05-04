import type { SidebarItem } from './DocSidebar';
import type { MarkdownTablesOfContentsElement } from './markdown-header-parser';

const getMarkdownDocsPageTemplate = (
  siteTitle: string,
  sidebar: readonly SidebarItem[],
  markdownPath: string,
  toc: readonly MarkdownTablesOfContentsElement[]
): string => {
  return `// ${'@'}generated
import React from 'react';
import DocPage from 'lib-react-docs/DocPage';
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

export default getMarkdownDocsPageTemplate;
