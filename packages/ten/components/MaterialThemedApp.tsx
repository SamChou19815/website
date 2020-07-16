import React, { ReactElement, ReactNode } from 'react';

import teal from '@material-ui/core/colors/teal';
import { MuiThemeProvider, StylesProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: { main: '#3E7AE2' },
    secondary: { main: teal[500] },
  },
});

type StyleProps = {
  readonly app?: string;
  readonly appBar?: string;
  readonly title?: string;
};

type Props = {
  readonly buttons?: ReactElement;
  readonly children: ReactNode;
  readonly title: string;
};

const MaterialThemedApp = ({ title, buttons, children }: Props): ReactElement => {
  return (
    <MuiThemeProvider theme={theme}>
      <StylesProvider injectFirst>
        <div>
          <nav className="navbar">
            <div className="navbar__inner">
              <div className="navbar__items">
                <a className="navbar__brand" href="/">
                  {title}
                </a>
              </div>
              <div className="navbar__items navbar__items--right">{buttons}</div>
            </div>
          </nav>
          {children}
        </div>
      </StylesProvider>
    </MuiThemeProvider>
  );
};

export default MaterialThemedApp;
