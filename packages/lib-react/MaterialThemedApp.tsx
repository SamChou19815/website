import React, { ReactElement, ReactNode } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({ palette: { primary: { main: '#3E7AE2' } } });

type AppBarPosition = 'fixed' | 'absolute' | 'sticky' | 'static' | 'relative';

type StyleProps = {
  readonly app?: string;
  readonly appBar?: string;
  readonly title?: string;
};

type Props = {
  readonly title: string;
  readonly appBarPosition: AppBarPosition;
  readonly styles: StyleProps;
  readonly buttons: ReactElement | null;
  readonly children: ReactNode;
};

const App = ({ title, styles, appBarPosition, buttons, children }: Props): ReactElement => (
  <MuiThemeProvider theme={theme}>
    <div className={styles.app}>
      <AppBar position={appBarPosition} className={styles.appBar}>
        <Toolbar>
          <Typography variant="h6" color="inherit" className={styles.title}>
            {title}
          </Typography>
          {buttons}
        </Toolbar>
      </AppBar>
      {children}
    </div>
  </MuiThemeProvider>
);

App.defaultProps = { appBarPosition: 'static' };

export default App;
