// @flow strict

import type { Node } from 'react';
import React from 'react';
// $FlowFixMe
import AppBar from '@material-ui/core/AppBar';
// $FlowFixMe
import Toolbar from '@material-ui/core/Toolbar';
// $FlowFixMe
import Typography from '@material-ui/core/Typography';
// $FlowFixMe
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
// $FlowFixMe
import { createMuiTheme } from '@material-ui/core/styles';
import styles from './App.module.css';
import ButtonLink from './components/ButtonLink';
import FirstPage from './components/FirstPage';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#3E7AE2',
    },
  },
  typography: { useNextVariants: true },
});

export default (): Node => (
  <MuiThemeProvider theme={theme}>
    <div className={styles.App}>
      <AppBar position="fixed" className={styles.AppBar}>
        <Toolbar>
          <Typography variant="h6" color="inherit" className={styles.Title}>
            Developer Sam
          </Typography>
          <ButtonLink href="/resume.pdf" className={styles.Resume}>Resume</ButtonLink>
          <ButtonLink href="https://blog.developersam.com">Blog</ButtonLink>
          <ButtonLink href="https://github.com/SamChou19815">GitHub</ButtonLink>
        </Toolbar>
      </AppBar>
      <FirstPage />
    </div>
  </MuiThemeProvider>
);
