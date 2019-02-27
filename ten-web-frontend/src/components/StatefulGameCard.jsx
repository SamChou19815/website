// @flow strict

import type { Node } from 'react';
import React from 'react';
import type { Board } from '../game/board';
import {
  emptyBoard,
  getGameStatus,
  makeMove,
  makeMoveWithoutCheck,
} from '../game/board';
import type { Status } from './GameCard';
import GameCard from './GameCard';

type GameState = {|
  +board: Board;
  +highlightedCell: [number, number] | null;
  +status: Status;
  +aiInfo: [number, number] | null;
|};

export const initialGameState: GameState = {
  board: emptyBoard,
  highlightedCell: null,
  status: 'PLAYER_MOVE',
  aiInfo: null,
};

type Props = {|
  +gameState: GameState;
  +setGameState: (GameState | (GameState => GameState)) => void;
  +aiResponder: (newBoard: Board) => void;
|};

/**
 * The game card in local mode.
 */
export default function StatefulGameCard({ gameState, setGameState, aiResponder }: Props): Node {
  const {
    board, highlightedCell, status, aiInfo,
  } = gameState;

  const clickCellCallback = (a: number, b: number) => {
    const move = [a, b];
    const newBoard = makeMove(board, move);
    if (newBoard === null) {
      setGameState(prev => ({ ...prev, status: 'ILLEGAL_MOVE' }));
      return;
    }
    const gameStatus = getGameStatus(newBoard);
    let newStatus;
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

  const onSelectSide = (id: 1 | -1) => {
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
