/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { emptyBoard, allLegalMovesForAI, makeMove, getGameStatus } from './board';

it('emptyBoard test', () => {
  expect(getGameStatus(emptyBoard)).toBe(0);
  expect(allLegalMovesForAI(emptyBoard).length).toBe(81);
});

it('makeMove test', () => {
  const board1 = makeMove(emptyBoard, [4, 4])!;
  expect(board1).toBeTruthy();
  expect(allLegalMovesForAI(board1).length).toBe(8);
  expect(makeMove(board1, [4, 4])).toBeNull();
  const board2 = makeMove(emptyBoard, [4, 2])!;
  expect(board2).toBeTruthy();
  expect(allLegalMovesForAI(board2).length).toBe(9);
});
