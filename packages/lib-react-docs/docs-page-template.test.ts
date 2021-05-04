import getMarkdownDocsPageTemplate from './docs-page-template';

it('getMarkdownDocsPageTemplate test', () => {
  expect(
    getMarkdownDocsPageTemplate(
      'Best Website',
      [{ type: 'link', label: 'A', href: '/aa' }],
      'intro.md',
      [{ label: 'bar', children: [{ label: 'baz', children: [] }] }]
    )
  ).toBe(`// ${'@'}generated
import React from 'react';
import DocPage from 'lib-react-docs/DocPage';
import Content from 'esbuild-scripts-internal/docs/intro.md';

const DocumentPage = () => (
  <DocPage
    siteTitle={\`Best Website\`}
    sidebar={[{"type":"link","label":"A","href":"/aa"}]}
    toc={[{"label":"bar","children":[{"label":"baz","children":[]}]}]}
  >
    <Content />
  </DocPage>
);
export default DocumentPage;
`);
});
