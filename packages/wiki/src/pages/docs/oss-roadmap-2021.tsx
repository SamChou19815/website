import React, { ReactElement } from 'react';

import documentSideBars from '../../docs/document-sidebars';
import Content from '../../docs/oss-roadmap-2021.md';

import DocPage from 'lib-react-docs/DocPage';

const DocsPageRoute = (): ReactElement => (
  <DocPage siteTitle="Wiki" sidebar={documentSideBars}>
    <Content />
  </DocPage>
);

export default DocsPageRoute;
