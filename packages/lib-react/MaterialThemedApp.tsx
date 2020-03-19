import React, { ReactElement, ComponentProps } from 'react';

import Typography from '@material-ui/core/Typography';

import MaterialPreConfiguredThemedApp from './MaterialPreConfiguredThemedApp';

type MaterialPreConfiguredThemedAppPassedThroughProps = Pick<
  ComponentProps<typeof MaterialPreConfiguredThemedApp>,
  'appBarPosition' | 'styles' | 'children'
>;

type Props = MaterialPreConfiguredThemedAppPassedThroughProps & {
  readonly title: string;
  readonly buttons: ReactElement | null;
};

const App = ({
  title,
  styles,
  appBarPosition = 'static',
  buttons,
  children
}: Props): ReactElement => {
  const toolBarChildren = (
    <>
      <Typography variant="h6" color="inherit" className={styles.title}>
        {title}
      </Typography>
      {buttons}
    </>
  );
  return (
    <MaterialPreConfiguredThemedApp
      appBarPosition={appBarPosition}
      styles={styles}
      toolBarChildren={toolBarChildren}
    >
      {children}
    </MaterialPreConfiguredThemedApp>
  );
};

App.defaultProps = { appBarPosition: 'static' };

export default App;
