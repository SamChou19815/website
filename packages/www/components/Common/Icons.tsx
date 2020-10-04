import React, { ReactElement } from 'react';

import styles from './Icons.module.css';

export type WwwSvgIconName =
  | 'code'
  | 'domain'
  | 'expand-more'
  | 'facebook'
  | 'github'
  | 'school'
  | 'work';

const WwwSvgIcon = ({ iconName }: { readonly iconName: WwwSvgIconName }): ReactElement => (
  <img src={`/icons/${iconName}.svg`} alt={iconName} className={styles.SvgIcon} />
);

export default WwwSvgIcon;
