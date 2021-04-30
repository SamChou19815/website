import React, { ReactElement, ReactNode } from 'react';

import DocSidebar from '../app/DocSidebar';
import documentSideBars from './document-sidebars';

import Head from 'esbuild-scripts/components/Head';
import { useLocation } from 'esbuild-scripts/components/router-hooks';

const DocsPage = ({ children }: { readonly children: ReactNode }): ReactElement => (
  <div className="top-level">
    <Head>
      <title>Docs | Wiki</title>
    </Head>
    <div className="sidebar-container">
      <DocSidebar sidebar={documentSideBars} activePath={useLocation().pathname} />
    </div>
    <main className="container document-container">
      <div className="container padding-vert--lg">{children}</div>
    </main>
  </div>
);

export default DocsPage;
