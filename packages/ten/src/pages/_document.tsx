import React, { ReactElement, ReactNode } from 'react';

import Head from 'esbuild-scripts/components/Head';

import 'infima/dist/css/default/default.min.css';
import './index.css';
import './game.css';

const Document = ({ children }: { readonly children: ReactNode }): ReactElement => (
  <>
    <Head>
      <html lang="en" />
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>TEN Game</title>
      <meta property="og:title" content="TEN Game" />
      <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no" />
      <link rel="shortcut icon" href="/favicon.ico" />
    </Head>
    {children}
  </>
);

export default Document;
