import React, { ReactElement, ComponentProps } from 'react';

import Typography from '@material-ui/core/Typography';

import MaterialPreConfiguredThemedApp from './MaterialPreConfiguredThemedApp';

type MaterialPreConfiguredThemedAppPassedThroughProps = Omit<
  ComponentProps<typeof MaterialPreConfiguredThemedApp>,
  'toolBarChildren'
>;

type Props = MaterialPreConfiguredThemedAppPassedThroughProps & {
  readonly title: string;
};

const App = ({
  title,
  styles,
  appBarPosition = 'static',
  buttons,
  children
}: Props): ReactElement => {
  const toolBarChildren = (
    <Typography variant="h6" color="inherit" className={styles.title}>
      {title}
    </Typography>
  );
  return (
    <MaterialPreConfiguredThemedApp
      appBarPosition={appBarPosition}
      styles={styles}
      toolBarChildren={toolBarChildren}
      buttons={buttons}
    >
      {children}
    </MaterialPreConfiguredThemedApp>
  );
};

App.defaultProps = { appBarPosition: 'static' };

export default App;
