import React, { ReactElement } from 'react';

import MaterialButtonLink from 'lib-react/MaterialButtonLink';
import MaterialThemedApp from 'lib-react/MaterialThemedApp';

import styles from './MaterialThemedApp.module.css';

const appStyles = {
  appBar: styles.AppBar,
  title: styles.Title,
};

const buttons: ReactElement = (
  <>
    <MaterialButtonLink href="https://blog.developersam.com" color="inherit">
      Blog
    </MaterialButtonLink>
    <MaterialButtonLink href="https://developersam.com" color="inherit">
      Main Site
    </MaterialButtonLink>
  </>
);

type Props = { readonly title: string; readonly children: ReactElement };

export default ({ title, children }: Props): ReactElement => (
  <MaterialThemedApp
    appBarPosition="static"
    styles={appStyles}
    title={`${title} - Queue`}
    buttons={buttons}
  >
    {children}
  </MaterialThemedApp>
);
