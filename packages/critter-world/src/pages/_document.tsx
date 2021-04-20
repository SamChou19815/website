import React, { ReactElement, ReactNode } from 'react';

import Head from 'esbuild-scripts/components/Head';

import 'infima/dist/css/default/default.min.css';
import './index.css';
import './app.css';

const Document = ({ children }: { readonly children: ReactNode }): ReactElement => (
  <>
    <Head>
      <html lang="en" />
      <meta name="viewport" content="width=device-width" />
      <meta charSet="utf-8" />
      <link rel="shortcut icon" href="https://developersam.com/favicon.ico" />
      <meta name="description" content="Critter World Web UI by Developer Sam" />
      <meta name="author" content="Developer Sam" />
      <title>Critter World Web UI</title>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700"
      />
    </Head>
    {children}
  </>
);

export default Document;
