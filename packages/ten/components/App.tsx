import React, { ReactElement } from 'react';

import Button from '@material-ui/core/Button';
import Head from 'next/head';

import DistributedGameCard from './DistributedGameCard';
import LocalGameCard from './LocalGameCard';
import MaterialThemedApp from './MaterialThemedApp';

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
    <MaterialThemedApp title={`TEN - ${mode}`} buttons={buttons}>
      <>
        {head}
        <div className="card">
          <div className="card__footer">
            <Button color="inherit" onClick={(): void => setMode('Local')}>
              Local
            </Button>
            <Button color="inherit" onClick={(): void => setMode('Distributed')}>
              Distributed
            </Button>
          </div>
        </div>
        {mode === 'Local' ? <LocalGameCard /> : <DistributedGameCard />}
      </>
    </MaterialThemedApp>
  );
}
