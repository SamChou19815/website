// @flow strict

import React from 'react';
// $FlowFixMe
import AppBar from '@material-ui/core/AppBar';
// $FlowFixMe
import Link from '@material-ui/core/Link';
// $FlowFixMe
import Button from '@material-ui/core/Button';
// $FlowFixMe
import Toolbar from '@material-ui/core/Toolbar';
// $FlowFixMe
import Typography from '@material-ui/core/Typography';
// $FlowFixMe
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
// $FlowFixMe
import { createMuiTheme } from '@material-ui/core/styles';
import styles from './App.module.css';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#263238',
    },
  },
  typography: { useNextVariants: true },
});

export default function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <div className={styles.App}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit" className={styles.Title}>
              Developer Sam
            </Typography>
            <Button color="inherit">
              <Link
                color="inherit"
                href="https://developersam.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Self
              </Link>
            </Button>
          </Toolbar>
        </AppBar>
        <div>TODO</div>
      </div>
    </MuiThemeProvider>
  );
}
