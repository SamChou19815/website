import React, { ReactElement } from 'react';
import styles from './BoardCell.module.css';

type Props = {
  readonly tileStatus: number;
  readonly doesNeedHighlight: boolean;
  readonly onClick: () => void;
};

/**
 * The board cell to display.
 *
 * @param {number} tileStatus the status of the tile.
 * @param {boolean} doesNeedHighlight whether the tile needs highlight.
 * @param {function(): void} onClick handle on click.
 * @return {Node} the rendered node.
 * @constructor
 */
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
