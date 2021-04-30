import React, { ReactElement, ReactNode } from 'react';

import Head from 'esbuild-scripts/components/Head';
import Link from 'esbuild-scripts/components/Link';

import 'infima/dist/css/default/default.min.css';
import 'lib-react-prism/PrismCodeBlock.css';
import 'lib-react-docs/styles.scss';
import './index.css';
import './app.scss';

const Document = ({ children }: { readonly children: ReactNode }): ReactElement => (
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
    <nav className="navbar navbar--fixed-top">
      <div className="navbar__inner">
        <div className="navbar__items">
          <Link className="navbar__brand" to="/">
            <img
              className="navbar__logo"
              src="https://developersam.com/logo.png"
              alt="Developer Sam logo"
            />
            <strong className="navbar__title">Wiki</strong>
          </Link>
          <Link className="navbar__item navbar__link" to="/docs/intro">
            Docs
          </Link>
          <Link className="navbar__item navbar__link" to="/intern">
            internals@dev-sam
          </Link>
        </div>
      </div>
    </nav>
    <div className="main-wrapper">{children}</div>
  </>
);

export default Document;
