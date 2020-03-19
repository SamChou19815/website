import React, { ReactElement, ReactNode } from 'react';

import { Typography } from '@material-ui/core';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import MaterialPreConfiguredThemedApp from 'lib-react/MaterialPreConfiguredThemedApp';
import { useHistory } from 'react-router';

import { APP_NAME } from '../../util/constants';
import styles from './MaterialThemedNavigableAppContainer.module.css';

type NestedNavigationLevel = { readonly title: string; readonly link?: string };

type Props = {
  readonly nestedNavigationLevels?: readonly NestedNavigationLevel[];
  readonly buttons?: ReactElement;
  readonly children: ReactNode;
};

export default ({ nestedNavigationLevels = [], buttons, children }: Props): ReactElement => {
  const history = useHistory();

  const toolBarChildren = (
    <Breadcrumbs aria-label="breadcrumb" className={styles.Title}>
      <Typography
        variant="h6"
        color="inherit"
        onClick={() => history.push('/')}
        className={styles.TitleLink}
      >
        {APP_NAME}
      </Typography>
      {nestedNavigationLevels.map(({ title, link }) => (
        <Typography
          key={title}
          variant="h6"
          color="inherit"
          onClick={link === undefined ? undefined : () => history.push(link)}
          className={styles.TitleLink}
        >
          {title}
        </Typography>
      ))}
    </Breadcrumbs>
  );

  return (
    <MaterialPreConfiguredThemedApp
      appBarPosition="static"
      toolBarChildren={toolBarChildren}
      styles={{ app: styles.App, title: styles.Title }}
      buttons={buttons}
    >
      {children}
    </MaterialPreConfiguredThemedApp>
  );
};
