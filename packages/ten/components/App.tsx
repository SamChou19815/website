import React, { ReactElement } from 'react';

import Button from '@material-ui/core/Button';
import Head from 'next/head';

import styles from './App.module.css';
import DistributedGameCard from './DistributedGameCard';
import LocalGameCard from './LocalGameCard';
import MaterialButtonLink from './MaterialButtonLink';

import MaterialThemedApp from 'lib-react/MaterialThemedApp';

type Mode = 'Local' | 'Distributed';

export default function App(): ReactElement {
  const [mode, setMode] = React.useState<Mode>('Local');

  const buttons = (
    <>
      <Button color="inherit" onClick={(): void => setMode('Local')}>
        Local
      </Button>
      <Button color="inherit" onClick={(): void => setMode('Distributed')}>
        Distributed
      </Button>
      <MaterialButtonLink href="https://developersam.com" color="inherit">
        Home
      </MaterialButtonLink>
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
    <MaterialThemedApp styles={{ title: styles.Title }} title={`TEN - ${mode}`} buttons={buttons}>
      <>
        {head}
        {mode === 'Local' ? <LocalGameCard /> : <DistributedGameCard />}
      </>
    </MaterialThemedApp>
  );
}
