import type { AppProps } from 'next/app';
import Head from 'next/head';
import type { ReactElement } from 'react';

import 'infima/dist/css/default/default.min.css';
import './index.css';
import { initializeWindowSizeHooksListeners } from '../utils/window-size-hook';

if (process.browser) {
  initializeWindowSizeHooksListeners();
}

const MaterialUIApp = ({ Component, pageProps }: AppProps): ReactElement => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <link rel="shortcut icon" href="https://developersam.com/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="theme-color" content="#F7F7F7" />
        <meta name="description" content="Critter World Web UI by Developer Sam" />
        <meta name="author" content="Developer Sam" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700"
        />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto+Mono:400,500" />
        <title>Critter World Web UI</title>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'http://schema.org',
              '@type': 'Person',
              name: 'Developer Sam',
              url: 'https://developersam.com',
              sameAs: [
                'https://www.developersam.com',
                'https://blog.developersam.com',
                'https://www.facebook.com/SamChou19815',
                'https://twitter.com/SamChou19815',
                'https://github.com/SamChou19815',
                'https://www.linkedin.com/in/sam-zhou-30b91610b/',
              ],
            }),
          }}
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default MaterialUIApp;
