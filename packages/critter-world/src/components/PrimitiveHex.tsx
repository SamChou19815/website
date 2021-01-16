/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import clsx from 'clsx';
import type { ReactElement, CSSProperties, ReactNode } from 'react';

import styles from './PrimitiveHex.module.css';

type Props = {
  readonly className?: string;
  readonly style?: CSSProperties;
  readonly color: string;
  readonly borderColor?: string;
  readonly radius: number;
  readonly onClick?: () => void;
  readonly children?: ReactNode;
};

const PrimitiveHex = ({
  className,
  style,
  radius,
  color,
  borderColor = 'black',
  onClick,
  children,
}: Props): ReactElement => (
  <div
    className={clsx(styles.PrimitiveHex, className)}
    // @ts-expect-error: custom css variable
    style={{ '--hex-radius': `${radius}px`, '--hex-color': borderColor, ...style }}
    onClick={onClick}
  >
    <div
      className={clsx(styles.PrimitiveHex, styles.PrimitiveHexInner, className)}
      // @ts-expect-error: custom css variable
      style={{ '--hex-radius': `${radius - 0.6}px`, '--hex-color': color }}
    >
      {children}
    </div>
  </div>
);

export default PrimitiveHex;
