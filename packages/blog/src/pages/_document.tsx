import React, { ReactElement, ReactNode } from 'react';

import Head from 'esbuild-scripts/components/Head';
import Link from 'esbuild-scripts/components/Link';

import 'infima/dist/css/default/default.min.css';
import './index.css';

const Document = ({ children }: { readonly children: ReactNode }): ReactElement => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width" />
        <meta charSet="utf-8" />
        <link rel="shortcut icon" href="https://developersam.com/favicon.ico" />
        <meta name="description" content="Developer Sam's Blog" />
        <meta property="og:description" content="Developer Sam's Blog" />
        <meta property="og:url" content="https://blog.developersam.com/" />
        <meta name="author" content="Developer Sam" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto+Mono:400,500" />
      </Head>
      <nav className="navbar navbar--fixed-top">
        <div className="navbar__inner">
          <div className="navbar__items">
            <Link className="navbar__brand" to="/">
              <img
                className="navbar__logo"
                src="https://developersam.com/logo.png"
                alt="Developer Sam Logo"
              />
              <strong className="navbar__title">Developer Sam Blog</strong>
            </Link>
          </div>
          <div className="navbar__items navbar__items--right">
            <a
              className="navbar__item navbar__link"
              href="https://developersam.com"
              target="_blank"
              rel="noreferrer"
            >
              Main Site
            </a>
            <a
              className="navbar__item navbar__link"
              href="https://github.com/SamChou19815/website"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </nav>
      <div className="main-wrapper">{children}</div>
      <footer className="footer footer--dark">
        <div className="container">
          <div className="footer__bottom text--center">
            <div className="footer__copyright">Copyright © 2016-2021 Developer Sam.</div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Document;
