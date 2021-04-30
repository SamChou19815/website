import React, { ReactElement, ReactNode } from 'react';

import documentSideBars from './document-sidebars';

import Head from 'esbuild-scripts/components/Head';
import { useLocation } from 'esbuild-scripts/components/router-hooks';
import DocLayout from 'lib-react-docs/DocLayout';

const DocsPage = ({ children }: { readonly children: ReactNode }): ReactElement => {
  const activePath = useLocation().pathname;
  const title = documentSideBars.find((it) => it.href === activePath)?.label ?? 'Docs';

  return (
    <DocLayout sidebar={documentSideBars} activePath={activePath}>
      <Head>
        <title>{title} | Wiki</title>
      </Head>
      <div className="container padding-vert--lg">{children}</div>
    </DocLayout>
  );
};

export default DocsPage;
