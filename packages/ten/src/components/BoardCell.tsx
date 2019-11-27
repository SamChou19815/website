import React, { ReactElement } from 'react';
import styles from './BoardCell.module.css';

type Props = {
  readonly tileStatus: number;
  readonly doesNeedHighlight: boolean;
  readonly onClick: () => void;
};

export default function BoardCell({ tileStatus, doesNeedHighlight, onClick }: Props): ReactElement {
  let backgroundColor: string;
  if (tileStatus === 1) {
    backgroundColor = 'black';
  } else if (tileStatus === -1) {
    backgroundColor = 'white';
  } else if (tileStatus === 0) {
    backgroundColor = '#DDDDDD';
  } else {
    throw new Error(`Bad tile status: ${tileStatus}!`);
  }
  const border = doesNeedHighlight ? '1px solid red' : '1px solid #CCC';
  const style = { backgroundColor, border };
  return <div role="presentation" className={styles.BoardCell} style={style} onClick={onClick} />;
}
