import React, { ReactElement, ReactNode } from 'react';

import { Typography } from '@material-ui/core';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import MaterialPreConfiguredThemedApp from 'lib-react/MaterialPreConfiguredThemedApp';

import { APP_NAME } from '../../util/constants';
import styles from './MaterialThemedNavigableAppContainer.module.css';

export type NestedNavigationLevel = { readonly title: string };

type Props = {
  readonly buttons?: ReactElement;
  readonly children: ReactNode;
};

export default ({ buttons, children }: Props): ReactElement => {
  const toolBarChildren = (
    <Breadcrumbs aria-label="breadcrumb" className={styles.Title}>
      <Typography variant="h6" color="inherit" className={styles.TitleLink}>
        {APP_NAME}
      </Typography>
    </Breadcrumbs>
  );

  return (
    <MaterialPreConfiguredThemedApp
      appBarPosition="fixed"
      toolBarChildren={toolBarChildren}
      styles={{ app: styles.App, title: styles.Title }}
      buttons={buttons}
    >
      {children}
    </MaterialPreConfiguredThemedApp>
  );
};
