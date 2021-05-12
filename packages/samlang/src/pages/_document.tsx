import React, { ReactElement, ReactNode } from 'react';

import Head from 'esbuild-scripts/components/Head';
import DocNavBar from 'lib-react-docs/DocNavBar';

import 'infima/dist/css/default/default.min.css';
import 'lib-react-docs/styles.scss';
import './custom.css';

const Document = ({ children }: { readonly children: ReactNode }): ReactElement => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width" />
        <meta charSet="utf-8" />
        <link rel="shortcut icon" href="/img/favicon.png" />
        <meta name="description" content="Sam's Programming Language" />
        <meta property="og:description" content="Sam's Programming Language" />
        <meta property="og:url" content="https://samlang.io/" />
      </Head>
      <DocNavBar
        title="samlang"
        logo="/img/logo.svg"
        logoName="samlang logo"
        githubLink="https://github.com/SamChou19815/samlang"
        firstDocumentLink="/docs/introduction"
        otherLinks={[{ name: 'Demo', link: '/demo' }]}
      />
      <div className="main-wrapper">{children}</div>
    </>
  );
};

export default Document;
