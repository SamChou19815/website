// @flow strict

import React from 'react';
// $FlowFixMe
import AppBar from '@material-ui/core/AppBar';
// $FlowFixMe
import Button from '@material-ui/core/Button';
// $FlowFixMe
import Toolbar from '@material-ui/core/Toolbar';
// $FlowFixMe
import Typography from '@material-ui/core/Typography';
// $FlowFixMe
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
// $FlowFixMe
import { blue as primary } from '@material-ui/core/colors';
// $FlowFixMe
import { createMuiTheme } from '@material-ui/core/styles';
import styles from './App.module.css';
import LanguageDemo from './LanguageDemo';

const theme = createMuiTheme({
  palette: { primary },
  typography: { useNextVariants: true },
});

export default function App() {
  const homeOnClick = () => window.open('https://developersam.com');
  const docsOnClick = () => window.open('https://samlang-docs.developersam.com');

  return (
    <MuiThemeProvider theme={theme}>
      <div className={styles.App}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit" className={styles.Title}>
              SAMLANG Type-checker & Interpreter Demo
            </Typography>
            <Button color="inherit" onClick={docsOnClick}>Docs</Button>
            <Button color="inherit" onClick={homeOnClick}>Home</Button>
          </Toolbar>
        </AppBar>
        <LanguageDemo />
      </div>
    </MuiThemeProvider>
  );
}
