import React, { ReactElement } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { createMuiTheme } from '@material-ui/core/styles';
import MaterialButtonLink from 'sam-react-common/MaterialButtonLink';
import styles from './App.module.css';
import LanguageDemo from './LanguageDemo';

const theme = createMuiTheme({ palette: { primary: { main: '#3E7AE2' } } });

export default function App(): ReactElement {
  return (
    <MuiThemeProvider theme={theme}>
      <div className={styles.App}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit" className={styles.Title}>
              SAMLANG Demo
            </Typography>
            <MaterialButtonLink
              href="https://samlang.developersam.com"
              color="inherit"
              openInNewTab
            >
              Docs
            </MaterialButtonLink>
            <MaterialButtonLink href="https://developersam.com" color="inherit" openInNewTab>
              Home
            </MaterialButtonLink>
          </Toolbar>
        </AppBar>
        <LanguageDemo />
      </div>
    </MuiThemeProvider>
  );
}
