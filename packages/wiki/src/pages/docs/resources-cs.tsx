import React, { ReactElement } from 'react';

import documentSideBars from '../../docs/document-sidebars';
import Content from '../../docs/resources-cs.md';

import DocPage from 'lib-react-docs/DocPage';

const DocsPageRoute = (): ReactElement => (
  <DocPage siteTitle="Wiki" sidebar={documentSideBars}>
    <Content />
  </DocPage>
);

export default DocsPageRoute;
