import React, { ReactElement } from 'react';

import {
  Board,
  Move,
  emptyBoard,
  getGameStatus,
  makeMove,
  makeMoveWithoutCheck,
} from '../game/board';
import type { GameState, GameStatus } from '../game/game-state';
import GameCard from './GameCard';

import { assertNotNull } from 'lib-common';

export const initialGameState: GameState = {
  board: emptyBoard,
  status: 'PLAYER_MOVE',
};

type Props = {
  readonly gameState: GameState;
  readonly setGameState: (stateOrStateF: GameState | ((s: GameState) => GameState)) => void;
  readonly aiResponder: (newBoard: Board) => void;
};

/**
 * The game card in local mode.
 */
export default function StatefulGameCard({
  gameState,
  setGameState,
  aiResponder,
}: Props): ReactElement {
  const { board } = gameState;

  const clickCellCallback = (a: number, b: number): void => {
    const move: Move = [a, b];
    const newBoard = makeMove(board, move);
    if (newBoard === null) {
      setGameState((prev): GameState => ({ ...prev, status: 'ILLEGAL_MOVE' }));
      return;
    }
    const gameStatus = getGameStatus(newBoard);
    let newStatus: GameStatus;
    if (gameStatus === 1) {
      newStatus = 'BLACK_WINS';
    } else if (gameStatus === -1) {
      newStatus = 'WHITE_WINS';
    } else {
      newStatus = 'AI_MOVE';
    }
    setGameState({
      board: newBoard,
      highlightedCell: move,
      status: newStatus,
    });
    aiResponder(newBoard);
  };

  const onSelectSide = (id: 1 | -1): void => {
    const newBoard = id === 1 ? emptyBoard : makeMoveWithoutCheck(emptyBoard, [4, 4]);
    setGameState({
      board: newBoard,
      status: 'PLAYER_MOVE',
    });
  };

  const onUndoMove = (): void => {
    const oldBoard = board.previousBoard?.previousBoard;
    assertNotNull(oldBoard);
    setGameState({
      board: oldBoard,
      status: 'PLAYER_MOVE',
    });
  };

  return (
    <GameCard
      gameState={gameState}
      board={board}
      clickCallback={clickCellCallback}
      onSelectSide={onSelectSide}
      onUndoMove={onUndoMove}
    />
  );
}
