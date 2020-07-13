import React, { ReactElement, ReactNode } from 'react';

// eslint-disable-next-line import/no-unresolved
import AppBar from '@material-ui/core/AppBar';
// eslint-disable-next-line import/no-unresolved
import Toolbar from '@material-ui/core/Toolbar';
// eslint-disable-next-line import/no-unresolved
import Typography from '@material-ui/core/Typography';

import MaterialAppContainer from './MaterialAppContainer';

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

const MaterialThemedApp = ({
  title,
  styles,
  appBarPosition = 'static',
  buttons,
  children,
}: Props): ReactElement => {
  return (
    <MaterialAppContainer>
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
    </MaterialAppContainer>
  );
};

export default MaterialThemedApp;
