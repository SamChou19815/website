import React, { ReactElement } from 'react';

import {
  Board,
  Move,
  emptyBoard,
  getGameStatus,
  makeMove,
  makeMoveWithoutCheck,
} from '../game/board';
import GameCard, { Status } from './GameCard';

type GameState = {
  readonly board: Board;
  readonly highlightedCell: [number, number] | null;
  readonly status: Status;
  readonly aiInfo: [number, number] | null;
};

export const initialGameState: GameState = {
  board: emptyBoard,
  highlightedCell: null,
  status: 'PLAYER_MOVE',
  aiInfo: null,
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
  const { board, highlightedCell, status, aiInfo } = gameState;

  const clickCellCallback = (a: number, b: number): void => {
    const move: Move = [a, b];
    const newBoard = makeMove(board, move);
    if (newBoard === null) {
      setGameState((prev): GameState => ({ ...prev, status: 'ILLEGAL_MOVE' }));
      return;
    }
    const gameStatus = getGameStatus(newBoard);
    let newStatus: Status;
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
      aiInfo: null,
    });
    aiResponder(newBoard);
  };

  const onSelectSide = (id: 1 | -1): void => {
    const newBoard = id === 1 ? emptyBoard : makeMoveWithoutCheck(emptyBoard, [4, 4]);
    setGameState({
      board: newBoard,
      highlightedCell: null,
      status: 'PLAYER_MOVE',
      aiInfo: null,
    });
  };

  return (
    <GameCard
      board={board}
      clickCallback={clickCellCallback}
      onSelectSide={onSelectSide}
      status={status}
      highlightedCell={highlightedCell}
      aiInfo={aiInfo}
    />
  );
}
