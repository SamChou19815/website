import React, { ReactElement } from 'react';

import BoardCell from './BoardCell';
import styles from './BoardGrid.module.css';

import { checkNotNull } from 'lib-common';

type Props = {
  readonly tiles: number[];
  readonly highlightedCell: [number, number] | null;
  readonly clickCallback: (a: number, b: number) => void;
};

/**
 * The board grid to display.
 *
 * @param {number[]} tiles the tiles array from the game engine.
 * @param {[number, number] | null} highlightedCell the cell to highlight or null.
 * @param {function(number, number): void} clickCallback the callback to call when click a tile.
 * @return {Node} the rendered node.
 * @constructor
 */
export default function BoardGrid({ tiles, highlightedCell, clickCallback }: Props): ReactElement {
  const children = [];
  for (let i = 0; i < 9; i += 1) {
    for (let j = 0; j < 9; j += 1) {
      const a = Math.floor(i / 3) * 3 + Math.floor(j / 3);
      const b = (i % 3) * 3 + (j % 3);
      const index = a * 9 + b;
      const tileStatus = checkNotNull(tiles[index]);
      let doesNeedHighlight = false;
      if (highlightedCell !== null) {
        const [c, d] = highlightedCell;
        if (a === c && b === d) {
          doesNeedHighlight = true;
        }
      }
      const onClick = (): void => clickCallback(a, b);
      children.push(
        <BoardCell
          key={index}
          tileStatus={tileStatus}
          doesNeedHighlight={doesNeedHighlight}
          onClick={onClick}
        />
      );
    }
  }
  return (
    <div className={styles.Grid}>
      {children}
      <div className={`${styles.HorizontalLine} ${styles.HorizontalLine1}`} />
      <div className={`${styles.HorizontalLine} ${styles.HorizontalLine2}`} />
      <div className={`${styles.VerticalLine} ${styles.VerticalLine1}`} />
      <div className={`${styles.VerticalLine} ${styles.VerticalLine2}`} />
    </div>
  );
}
