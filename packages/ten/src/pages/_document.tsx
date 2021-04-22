import React, { ReactElement, ReactNode } from 'react';

import Head from 'esbuild-scripts/components/Head';
import Link from 'esbuild-scripts/components/Link';

import 'infima/dist/css/default/default.min.css';
import './index.scss';
import './game.scss';

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
    <nav className="navbar">
      <div className="navbar__inner">
        <div className="navbar__items">
          <a className="navbar__brand" href="/">
            <img className="navbar__logo" src="/logo.png" alt="TEN App logo" />
            <strong className="navbar__title">TEN</strong>
          </a>
        </div>
        <div className="navbar__items navbar__items--right">
          <Link className="navbar__item navbar__link" to="/">
            Play against AI
          </Link>
          <Link className="navbar__item navbar__link" to="/local">
            Play locally
          </Link>
          <Link className="navbar__item navbar__link" to="/rules">
            Rules
          </Link>
          <a className="navbar__item navbar__link" href="https://developersam.com">
            Home
          </a>
        </div>
      </div>
    </nav>
    {children}
  </>
);

export default Document;