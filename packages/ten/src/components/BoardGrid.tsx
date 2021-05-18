import React from 'react';

import BoardCell from './BoardCell';

type Props = {
  readonly tiles: readonly number[];
  readonly lastMove?: readonly [number, number];
  readonly clickCallback: (a: number, b: number) => void;
};

export default function BoardGrid({ tiles, lastMove, clickCallback }: Props): JSX.Element {
  const children = [];
  for (let i = 0; i < 9; i += 1) {
    for (let j = 0; j < 9; j += 1) {
      const a = Math.floor(i / 3) * 3 + Math.floor(j / 3);
      const b = (i % 3) * 3 + (j % 3);
      const index = a * 9 + b;
      const tileStatus = tiles[index];
      if (tileStatus == null) throw new Error();
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
      <div className="h-line l1" />
      <div className="h-line l2" />
      <div className="v-line l1" />
      <div className="v-line l2" />
    </div>
  );
}
