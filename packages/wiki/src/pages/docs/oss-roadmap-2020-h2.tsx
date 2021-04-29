import React, { ReactElement } from 'react';

import DocsPage from '../../docs/DocsPage';
import Content from '../../docs/oss-roadmap-2020-h2.md';

const DocsPageRoute = (): ReactElement => (
  <DocsPage>
    <Content />
  </DocsPage>
);

export default DocsPageRoute;
