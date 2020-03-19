import React, { ReactElement, ReactNode } from 'react';

import { Typography } from '@material-ui/core';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import MaterialPreConfiguredThemedApp from 'lib-react/MaterialPreConfiguredThemedApp';
import { useHistory } from 'react-router';

import { APP_NAME } from '../../util/constants';
import styles from './MaterialThemedAppContainer.module.css';

type NestedNavigationLevel = { readonly title: string; readonly link: string };

type Props = {
  readonly nestedNavigationLevels?: readonly NestedNavigationLevel[];
  readonly buttons: ReactElement | null;
  readonly children: ReactNode;
};

export default ({ nestedNavigationLevels = [], buttons, children }: Props): ReactElement => {
  const history = useHistory();

  const toolBarChildren = (
    <Breadcrumbs aria-label="breadcrumb" className={styles.Title}>
      <Link onClick={() => history.push('/')} className={styles.TitleLink}>
        <Typography variant="h6" color="inherit">
          {APP_NAME}
        </Typography>
      </Link>
      {nestedNavigationLevels.map(({ title, link }) => (
        <Link key={title} onClick={() => history.push(link)} className={styles.TitleLink}>
          <Typography variant="h6" color="inherit">
            {title}
          </Typography>
        </Link>
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
