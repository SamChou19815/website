import clsx from 'clsx';
import React, { ReactElement, ReactNode } from 'react';

import Head from 'esbuild-scripts/components/Head';
import Link from 'esbuild-scripts/components/Link';
import { useLocation } from 'esbuild-scripts/components/router-hooks';

import 'infima/dist/css/default/default.min.css';
import './index.scss';
import './game.scss';

const Document = ({ children }: { readonly children: ReactNode }): ReactElement => {
  const path = useLocation().pathname;

  const activeNavClass = (expectedPath: string) =>
    clsx('navbar__item', 'navbar__link', path === expectedPath && 'navbar__link--active');
  return (
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
            <Link className={activeNavClass('/')} to="/">
              Play against AI
            </Link>
            <Link className={activeNavClass('/local')} to="/local">
              Play locally
            </Link>
            <Link className={activeNavClass('/online')} to="/online">
              Play online
            </Link>
            <Link className={activeNavClass('/rules')} to="/rules">
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
};

export default Document;
