import React, { ReactElement } from 'react';

import DocsPage from '../../docs/DocsPage';
import Content from '../../docs/resources-cs.md';

const DocsPageRoute = (): ReactElement => (
  <DocsPage>
    <Content />
  </DocsPage>
);

export default DocsPageRoute;
