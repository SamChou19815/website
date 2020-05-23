import React, { ReactElement, ReactNode } from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import teal from '@material-ui/core/colors/teal';
import { MuiThemeProvider, StylesProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: { main: '#3E7AE2' },
    secondary: { main: teal[500] },
  },
});

type AppBarPosition = 'fixed' | 'absolute' | 'sticky' | 'static' | 'relative';

type StyleProps = {
  readonly app?: string;
  readonly appBar?: string;
  readonly title?: string;
};

type Props = {
  readonly appBarPosition?: AppBarPosition;
  readonly styles: StyleProps;
  readonly buttons?: ReactElement;
  readonly children: ReactNode;
  readonly title: string;
};

const App = ({
  title,
  styles,
  appBarPosition = 'static',
  buttons,
  children,
}: Props): ReactElement => {
  return (
    <MuiThemeProvider theme={theme}>
      <StylesProvider injectFirst>
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
      </StylesProvider>
    </MuiThemeProvider>
  );
};

export default App;
