import React, { ReactElement } from 'react';
import Button from '@material-ui/core/Button';
import MaterialThemedApp from 'sam-react-common/MaterialThemedApp';
import MaterialButtonLink from 'sam-react-common/MaterialButtonLink';
import DistributedGameCard from './components/DistributedGameCard';
import LocalGameCard from './components/LocalGameCard';
import styles from './App.module.css';

type Mode = 'Local' | 'Distributed';

export default function App(): ReactElement {
  const [mode, setMode] = React.useState<Mode>('Local');

  return (
    <MaterialThemedApp
      styles={{ title: styles.Title }}
      title={`TEN - ${mode}`}
      buttons={(
        <>
          <Button color="inherit" onClick={(): void => setMode('Local')}>
            Local
          </Button>
          <Button color="inherit" onClick={(): void => setMode('Distributed')}>
            Distributed
          </Button>
          <MaterialButtonLink href="https://developersam.com" color="inherit" openInNewTab>
            Home
          </MaterialButtonLink>
        </>
      )}
    >
      {mode === 'Local' ? <LocalGameCard /> : <DistributedGameCard />}
    </MaterialThemedApp>
  );
}
