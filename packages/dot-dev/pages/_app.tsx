import React, { ReactElement, useEffect } from 'react';

import type { AppProps } from 'next/app';
import Head from 'next/head';
import ReactGA from 'react-ga';

import 'infima/dist/css/default/default.min.css';
import './index.css';

const themeAutoSwitcher = `(function() {
function t(theme){document.documentElement.setAttribute('data-theme', theme)}
if(window.matchMedia('(prefers-color-scheme: light)').matches)t('')
if(window.matchMedia('(prefers-color-scheme: dark)').matches)t('dark')
window.matchMedia('(prefers-color-scheme: dark)').addListener(({matches:m})=>t(m?'dark':''))
})();`;

const App = (props: AppProps): ReactElement => {
  const { Component, pageProps } = props;

  useEffect(() => {
    if (process.browser) {
      ReactGA.initialize('UA-140662756-1');
      ReactGA.pageview(window.location.pathname + window.location.search);
    }
  }, []);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <link rel="shortcut icon" href="https://developersam.com/favicon.ico" />
        <title>Random@dev-sam</title>
        <script
          type="text/javascript"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: themeAutoSwitcher }}
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default App;
