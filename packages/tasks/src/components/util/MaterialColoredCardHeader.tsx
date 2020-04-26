import React, { ReactElement, ReactNode } from 'react';

import CardHeader from '@material-ui/core/CardHeader';

import { SanctionedColor } from '../../models/common-types';
import styles from './MaterialColoredCardHeader.module.css';

const getHeaderClassname = (color: SanctionedColor): string => {
  switch (color) {
    case 'Red':
      return `${styles.CardHeader} ${styles.CardColorRed}`;
    case 'Pink':
      return `${styles.CardHeader} ${styles.CardColorPink}`;
    case 'Purple':
      return `${styles.CardHeader} ${styles.CardColorPurple}`;
    case 'Indigo':
      return `${styles.CardHeader} ${styles.CardColorIndigo}`;
    case 'Blue':
      return `${styles.CardHeader} ${styles.CardColorBlue}`;
    case 'Teal':
      return `${styles.CardHeader} ${styles.CardColorTeal}`;
    case 'Green':
      return `${styles.CardHeader} ${styles.CardColorGreen}`;
    case 'Light Green':
      return `${styles.CardHeader} ${styles.CardColorLightGreen}`;
    case 'Orange':
      return `${styles.CardHeader} ${styles.CardColorOrange}`;
    case 'Gray':
      return `${styles.CardHeader} ${styles.CardColorGray}`;
    default:
      throw new Error(`Unknown sanctioned color: ${color}`);
  }
};

type Props = {
  readonly title: string;
  readonly color: SanctionedColor;
  readonly avatar?: ReactNode;
  readonly titleClassName?: string;
  readonly onClick?: () => void;
};

export default ({ title, color, avatar, titleClassName, onClick }: Props): ReactElement => (
  <CardHeader
    avatar={avatar}
    classes={{
      root: getHeaderClassname(color),
      title: titleClassName,
    }}
    title={title}
    titleTypographyProps={{ variant: 'h6' }}
    onClick={onClick}
  />
);
