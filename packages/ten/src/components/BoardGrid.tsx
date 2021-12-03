import React from 'react';

import BoardCell from './BoardCell';

type Props = {
  readonly tiles: readonly number[];
  readonly lastMove?: readonly [number, number];
  readonly clickCallback: (a: number, b: number) => void;
};

export default function BoardGrid({ tiles, lastMove, clickCallback }: Props): JSX.Element {
  const children: JSX.Element[] = [];
  for (let i = 0; i < 9; i += 1) {
    const cells: JSX.Element[] = [];
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
      cells.push(
        <BoardCell
          key={index}
          tileStatus={tileStatus}
          doesNeedHighlight={doesNeedHighlight}
          onClick={() => clickCallback(a, b)}
        />
      );
    }
    children.push(
      <div key={i} className="flex justify-center">
        {cells}
      </div>
    );
  }
  return (
    <div className="flex flex-col justify-center relative w-80 h-80 p-4">
      {children}
      <div className="bg-gray-800 absolute top-4 left-1/3 h-72 w-px transform translate-x-1" />
      <div className="bg-gray-800 absolute top-4 right-1/3 h-72 w-px transform -translate-x-1" />
      <div className="bg-gray-800 absolute left-4 top-1/3 w-72 h-px transform translate-y-1" />
      <div className="bg-gray-800 absolute left-4 bottom-1/3 w-72 h-px transform -translate-y-1" />
    </div>
  );
}
