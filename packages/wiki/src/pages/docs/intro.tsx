import React, { ReactElement } from 'react';

import DocsPage from '../../docs/DocsPage';
import Content from '../../docs/intro.md';

const DocsPageRoute = (): ReactElement => (
  <DocsPage>
    <Content />
  </DocsPage>
);

export default DocsPageRoute;
