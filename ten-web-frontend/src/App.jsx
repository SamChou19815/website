// @flow strict

import type { Node } from 'react';
import React from 'react';
// $FlowFixMe
import Button from '@material-ui/core/Button';
// $FlowFixMe
import AppBar from '@material-ui/core/AppBar';
// $FlowFixMe
import Link from '@material-ui/core/Link';
// $FlowFixMe
import Toolbar from '@material-ui/core/Toolbar';
// $FlowFixMe
import Typography from '@material-ui/core/Typography';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
// $FlowFixMe
import { blueGrey } from '@material-ui/core/colors';
// $FlowFixMe
import { createMuiTheme } from '@material-ui/core/styles';
import DistributedGameCard from './components/DistributedGameCard';
import LocalGameCard from './components/LocalGameCard';
import styles from './App.module.css';

type Mode = 'Local' | 'Distributed';

const theme = createMuiTheme({
  palette: { primary: blueGrey },
  typography: { useNextVariants: true },
});

export default function App(): Node {
  const [mode, setMode] = React.useState<Mode>('Local');

  return (
    <MuiThemeProvider theme={theme}>
      <div className={styles.App}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit" className={styles.Title}>
              {`TEN - ${mode}`}
            </Typography>
            <Button color="inherit" onClick={() => setMode('Local')}>Local</Button>
            <Button color="inherit" onClick={() => setMode('Distributed')}>Distributed</Button>
            <Button color="inherit">
              <Link
                color="inherit"
                href="https://developersam.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Home
              </Link>
            </Button>
          </Toolbar>
        </AppBar>
        {mode === 'Local' ? <LocalGameCard /> : <DistributedGameCard />}
      </div>
    </MuiThemeProvider>
  );
}
