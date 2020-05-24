import React, { ReactElement, ReactNode } from 'react';

import teal from '@material-ui/core/colors/teal';
import { MuiThemeProvider, StylesProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: { main: '#3E7AE2' },
    secondary: { main: teal[500] },
  },
});

const MaterialAppContainer = ({ children }: { readonly children: ReactNode }): ReactElement => {
  return (
    <MuiThemeProvider theme={theme}>
      <StylesProvider injectFirst>{children}</StylesProvider>
    </MuiThemeProvider>
  );
};

export default MaterialAppContainer;
