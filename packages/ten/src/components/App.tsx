import React, { ReactElement } from 'react';

import Head from '@docusaurus/Head';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import StatefulGameCard from './StatefulGameCard';

export default function App(): ReactElement {
  const { siteConfig = {} } = useDocusaurusContext();
  const { favicon } = siteConfig;
  const faviconUrl = useBaseUrl(favicon);

  const buttons = (
    <>
      <a className="navbar__item navbar__link" href="https://developersam.com">
        Home
      </a>
    </>
  );

  const head = (
    <Head>
      <html lang="en" />
      <title>TEN Game</title>
      <meta property="og:title" content="TEN Game" />
      <link rel="shortcut icon" href={faviconUrl} />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    </Head>
  );

  return (
    <div>
      {head}
      <nav className="navbar">
        <div className="navbar__inner">
          <div className="navbar__items">
            <a className="navbar__brand" href="/">
              <img className="navbar__logo" src="/logo.png" alt="TEN App logo" />
              <strong className="navbar__title">TEN</strong>
            </a>
          </div>
          <div className="navbar__items navbar__items--right">{buttons}</div>
        </div>
      </nav>
      <StatefulGameCard />
      <div className="card">
        <div className="card__header">Rules</div>
        <div className="card__body">
          The rules are mostly the same with the original&nbsp;
          <a href="https://en.wikipedia.org/wiki/Ultimate_tic-tac-toe">
            TEN game (Ultimate tic-tac-toe)
          </a>
          , except that a draw is a win for white in this game. AI thinking time is 1.5s.
        </div>
      </div>
    </div>
  );
}
