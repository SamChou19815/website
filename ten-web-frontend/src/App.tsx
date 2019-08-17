import React, { ReactElement } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { blueGrey as primary } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';
import DistributedGameCard from './components/DistributedGameCard';
import LocalGameCard from './components/LocalGameCard';
import styles from './App.module.css';

type Mode = 'Local' | 'Distributed';

const theme = createMuiTheme({ palette: { primary } });

export default function App(): ReactElement {
  const [mode, setMode] = React.useState<Mode>('Local');

  return (
    <MuiThemeProvider theme={theme}>
      <div className={styles.App}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit" className={styles.Title}>
              {`TEN - ${mode}`}
            </Typography>
            <Button color="inherit" onClick={(): void => setMode('Local')}>
              Local
            </Button>
            <Button color="inherit" onClick={(): void => setMode('Distributed')}>
              Distributed
            </Button>
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
