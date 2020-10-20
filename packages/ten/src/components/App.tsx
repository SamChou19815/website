import React, { ReactElement } from 'react';

import Head from '@docusaurus/Head';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import DistributedGameCard from './DistributedGameCard';

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
      <DistributedGameCard />
    </div>
  );
}
