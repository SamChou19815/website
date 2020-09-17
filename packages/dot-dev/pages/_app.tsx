/* eslint-disable jsx-a11y/anchor-is-valid */

import React, { ReactElement, useEffect } from 'react';

import type { AppProps } from 'next/app';
import Head from 'next/head';
import Link from 'next/link';
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
      <nav className="navbar">
        <div className="navbar__inner">
          <div className="navbar__items">
            <Link href="/">
              <a className="navbar__brand">Random@dev-sam</a>
            </Link>
          </div>
          <div className="navbar__items navbar__items--right">
            <a className="navbar__item navbar__link" href="https://developersam.com">
              Home
            </a>
          </div>
        </div>
      </nav>
      <Component {...pageProps} />
    </>
  );
};

export default App;
