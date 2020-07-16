import React, { ReactElement } from 'react';

import Head from 'next/head';

import DistributedGameCard from './DistributedGameCard';
import LocalGameCard from './LocalGameCard';

type Mode = 'Local' | 'Distributed';

export default function App(): ReactElement {
  const [mode, setMode] = React.useState<Mode>('Local');

  const buttons = (
    <>
      <a className="navbar__item navbar__link" href="https://developersam.com">
        Home
      </a>
    </>
  );

  const head = (
    <Head>
      <meta charSet="utf-8" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="theme-color" content="#000000" />
      <link rel="manifest" href="/manifest.json" />
      <title>TEN Game</title>
    </Head>
  );

  return (
    <div>
      {head}
      <nav className="navbar">
        <div className="navbar__inner">
          <div className="navbar__items">
            <a className="navbar__brand" href="/">
              {`TEN - ${mode}`}
            </a>
          </div>
          <div className="navbar__items navbar__items--right">{buttons}</div>
        </div>
      </nav>
      <div className="card">
        <div className="card__footer">
          <button
            className="button button--outline button--primary"
            onClick={(): void => setMode('Local')}
          >
            Local
          </button>
          <button
            className="button button--outline button--primary"
            onClick={(): void => setMode('Distributed')}
          >
            Distributed
          </button>
        </div>
      </div>
      {mode === 'Local' ? <LocalGameCard /> : <DistributedGameCard />}
    </div>
  );
}
