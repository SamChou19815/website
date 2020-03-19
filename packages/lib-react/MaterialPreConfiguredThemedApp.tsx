import React, { ReactElement, ReactNode } from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import teal from '@material-ui/core/colors/teal';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: { main: '#3E7AE2' },
    secondary: { main: teal[500] }
  }
});

type AppBarPosition = 'fixed' | 'absolute' | 'sticky' | 'static' | 'relative';

type StyleProps = {
  readonly app?: string;
  readonly appBar?: string;
  readonly title?: string;
};

type Props = {
  readonly appBarPosition: AppBarPosition;
  readonly styles: StyleProps;
  readonly toolBarChildren: ReactElement;
  readonly buttons?: ReactElement;
  readonly children: ReactNode;
};

export default ({
  styles,
  appBarPosition,
  toolBarChildren,
  buttons,
  children
}: Props): ReactElement => (
  <MuiThemeProvider theme={theme}>
    <div className={styles.app}>
      <AppBar position={appBarPosition} className={styles.appBar}>
        <Toolbar>
          {toolBarChildren}
          {buttons}
        </Toolbar>
      </AppBar>
      {children}
    </div>
  </MuiThemeProvider>
);
