import React, { FC } from 'react';

import DocSidebar from '../app/DocSidebar';
import documentSideBars from './document-sidebars';

import Head from 'esbuild-scripts/components/Head';

const DocsPage: FC = ({ children }) => (
  <div className="top-level">
    <Head>
      <title>Docs | Wiki</title>
    </Head>
    <div className="sidebar-container">
      <DocSidebar sidebar={documentSideBars} />
    </div>
    <main className="document-container">
      <div className="container padding-vert--lg">{children}</div>
    </main>
  </div>
);

export default DocsPage;
