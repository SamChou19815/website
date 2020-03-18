import React, { ReactElement } from 'react';
import MaterialThemedApp from 'lib-react/MaterialThemedApp';
import { APP_NAME } from '../../util/constants';
import styles from './MaterialThemedAppContainer.module.css';

type Props = {
  readonly title: string;
  readonly buttons: ReactElement | null;
  readonly children: ReactElement;
};

export default ({ title, buttons, children }: Props): ReactElement => (
  <MaterialThemedApp
    title={title === '' ? APP_NAME : `${title} - ${APP_NAME}`}
    buttons={buttons}
    styles={{ app: styles.App, title: styles.Title }}
  >
    {children}
  </MaterialThemedApp>
);
