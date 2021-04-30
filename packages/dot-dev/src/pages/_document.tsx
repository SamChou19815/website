import React, { ReactElement, ReactNode } from 'react';

import Head from 'esbuild-scripts/components/Head';
import initializeThemeSwitching from 'lib-theme-switcher';

import 'infima/dist/css/default/default.min.css';
import './index.scss';

if (!__SERVER__) {
  initializeThemeSwitching();
}

const Document = ({ children }: { readonly children: ReactNode }): ReactElement => (
  <>
    <Head>
      <meta name="viewport" content="width=device-width" />
      <meta charSet="utf-8" />
      <link rel="shortcut icon" href="https://developersam.com/favicon.ico" />
      <meta name="description" content="Random stuff about Developer Sam" />
      <meta name="author" content="Developer Sam" />
      <title>Fan Arts | Random@dev-sam</title>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700"
      />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto+Mono:400,500" />
    </Head>
    {children}
  </>
);

export default Document;
