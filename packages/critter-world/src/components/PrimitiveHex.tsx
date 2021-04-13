/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { ReactElement, CSSProperties, ReactNode } from 'react';

type Props = {
  readonly style?: CSSProperties;
  readonly color: string;
  readonly borderColor?: string;
  readonly radius: number;
  readonly onClick?: () => void;
  readonly children?: ReactNode;
};

const PrimitiveHex = ({
  style,
  radius,
  color,
  borderColor = 'black',
  onClick,
  children,
}: Props): ReactElement => (
  <div
    className="primitive-hex"
    // @ts-expect-error: custom css variable
    style={{ '--hex-radius': `${radius}px`, '--hex-color': borderColor, ...style }}
    onClick={onClick}
  >
    <div
      className="primitive-hex primitive-hex-inner"
      // @ts-expect-error: custom css variable
      style={{ '--hex-radius': `${radius - 0.6}px`, '--hex-color': color }}
    >
      {children}
    </div>
  </div>
);

export default PrimitiveHex;
