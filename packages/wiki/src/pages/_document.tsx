import React, { ReactElement, ReactNode } from 'react';

import Head from 'esbuild-scripts/components/Head';
import DocNavBar from 'lib-react-docs/DocNavBar';

import 'infima/dist/css/default/default.min.css';
import 'lib-react-prism/PrismCodeBlock.css';
import 'lib-react-docs/styles.scss';
import './index.css';
import './app.scss';

const Document = ({ children }: { readonly children: ReactNode }): ReactElement => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width" />
        <meta charSet="utf-8" />
        <link rel="shortcut icon" href="https://developersam.com/favicon.ico" />
        <meta name="description" content="Developer Sam's Wiki" />
        <meta property="og:description" content="Developer Sam's Wiki" />
        <meta property="og:url" content="https://wiki.developersam.com/" />
        <meta name="author" content="Developer Sam" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700"
        />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto+Mono:400,500" />
      </Head>
      <DocNavBar
        title="Wiki"
        logo="https://developersam.com/logo.png"
        logoName="Developer Sam logo"
        githubLink="https://github.com/SamChou19815/website"
        firstDocumentLink="/docs/intro"
        otherLinks={[{ name: 'internals@dev-sam', link: '/intern' }]}
      />
      <div className="main-wrapper">{children}</div>
    </>
  );
};

export default Document;
