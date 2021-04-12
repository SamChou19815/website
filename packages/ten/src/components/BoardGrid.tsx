import React, { ReactElement } from 'react';

import BoardCell from './BoardCell';

import { checkNotNull } from 'lib-common';

type Props = {
  readonly tiles: readonly number[];
  readonly lastMove?: readonly [number, number];
  readonly clickCallback: (a: number, b: number) => void;
};

export default function BoardGrid({ tiles, lastMove, clickCallback }: Props): ReactElement {
  const children = [];
  for (let i = 0; i < 9; i += 1) {
    for (let j = 0; j < 9; j += 1) {
      const a = Math.floor(i / 3) * 3 + Math.floor(j / 3);
      const b = (i % 3) * 3 + (j % 3);
      const index = a * 9 + b;
      const tileStatus = checkNotNull(tiles[index]);
      let doesNeedHighlight = false;
      if (lastMove != null) {
        const [c, d] = lastMove;
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
    <div className="board-grid">
      {children}
      <div className="board-horizontal-line board-horizontal-line-1" />
      <div className="board-horizontal-line board-horizontal-line-2" />
      <div className="board-vertical-line board-vertical-line-1" />
      <div className="board-vertical-line board-vertical-line-2" />
    </div>
  );
}
