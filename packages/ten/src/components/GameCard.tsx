import React, { ReactNode } from 'react';
import { Board, getGameStatus } from '../game/board';
import type { GameState } from '../game/game-state';
import BoardGrid from './BoardGrid';
import Button from './Button';

function getMessage(board: Board, playerCanMove: boolean, playerMadeIllegalMove: boolean): string {
  switch (getGameStatus(board)) {
    case 0:
      if (!playerCanMove) {
        return "Waiting for other player's move.";
      }
      return playerMadeIllegalMove ? 'Illegal move!' : 'Waiting for your move.';
    case 1:
      return 'Black Wins';
    case -1:
      return 'White Wins';
  }
}

type Props = {
  readonly gameState: GameState;
  readonly playerCanMove: boolean;
  readonly playerMadeIllegalMove: boolean;
  readonly showUndoButton: boolean;
  readonly children?: ReactNode;
  readonly clickCallback: (a: number, b: number) => void;
  readonly onUndoMove?: () => void;
};

export default function GameCard({
  gameState: { board, aiInfo },
  playerCanMove,
  playerMadeIllegalMove,
  showUndoButton,
  children,
  clickCallback,
  onUndoMove,
}: Props): JSX.Element {
  const { tiles } = board;
  let aiInfoNode: JSX.Element | null;
  if (aiInfo == null) {
    aiInfoNode = null;
  } else {
    const { winningPercentage, simulationCounter } = aiInfo;
    aiInfoNode = (
      <>
        <div className="p-4 pb-0">{`AI Winning Probability ${winningPercentage}%.`}</div>
        <div className="p-4 pb-0">{`Number of Simulations Run: ${simulationCounter}.`}</div>
      </>
    );
  }
  return (
    <>
      <div className="m-2 sm:my-8 sm:m-auto bg-white flex flex-col rounded-sm sm:w-96">
        <h2 className="p-4 pb-0 text-lg font-bold">Game</h2>
        <div className="p-4">{getMessage(board, playerCanMove, playerMadeIllegalMove)}</div>
        {aiInfoNode}
        <div className="p-4 flex justify-center relative">
          {!playerCanMove && <div className="absolute inset-0 z-10 bg-white bg-opacity-75" />}
          <BoardGrid tiles={tiles} lastMove={board.lastMove} clickCallback={clickCallback} />
        </div>
        {children}
        {showUndoButton && (
          <div className="p-4 pt-0 flex justify-center items-center">
            <Button onClick={onUndoMove}>Undo your last move</Button>
          </div>
        )}
      </div>
      <div className="m-2 sm:my-8 sm:m-auto bg-white flex flex-col rounded-sm sm:w-96">
        <h2 className="p-4 pb-0 text-lg font-bold">Rules</h2>
        <div className="p-4">
          The rules are mostly the same with the original{' '}
          <a href="https://en.wikipedia.org/wiki/Ultimate_tic-tac-toe">
            TEN game (Ultimate tic-tac-toe)
          </a>
          , except that a draw is a win for white in this game. AI thinking time is 1.5s.
        </div>
      </div>
    </>
  );
}
