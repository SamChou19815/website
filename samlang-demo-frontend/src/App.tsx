import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { blue as primary } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';
import styles from './App.module.css';
import LanguageDemo from './LanguageDemo';

const theme = createMuiTheme({
  palette: { primary },
  typography: { useNextVariants: true },
});

export default function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <div className={styles.App}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit" className={styles.Title}>
              SAMLANG Demo
            </Typography>
            <Button color="inherit">
              <Link
                color="inherit"
                href="https://samlang.developersam.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Docs
              </Link>
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
        <LanguageDemo />
      </div>
    </MuiThemeProvider>
  );
}
