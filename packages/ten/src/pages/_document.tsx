import clsx from 'clsx';
import CommonHeader from 'esbuild-scripts/components/CommonHeader';
import Link from 'esbuild-scripts/components/Link';
import { useLocation } from 'esbuild-scripts/components/router-hooks';
import React, { ReactNode } from 'react';

import './index.scss';
import './game.scss';

export default function Document({ children }: { readonly children: ReactNode }): JSX.Element {
  const path = useLocation().pathname;

  const activeNavClass = (expectedPath: string) =>
    clsx('navbar__item', 'navbar__link', path === expectedPath && 'navbar__link--active');

  return (
    <>
      <CommonHeader
        title="TEN Game"
        description="TEN Game"
        shortcutIcon="/favicon.ico"
        htmlLang="en"
      />
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
}
