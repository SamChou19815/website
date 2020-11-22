import React, { ReactElement, useState } from 'react';

import {
  Move,
  Board,
  emptyBoard,
  boardToJson,
  getGameStatus,
  makeMove,
  makeMoveWithoutCheck,
} from '../game/board';
import type { GameState, GameStatus } from '../game/game-state';
import type { MctsResponse } from '../game/mcts';
import GameCard from './GameCard';

import { assertNotNull } from 'lib-common';

const initialGameState: GameState = { board: emptyBoard, status: 'PLAYER_MOVE' };

const aiResponder = async (board: Board): Promise<GameState> =>
  fetch('/api/respond', { method: 'POST', body: JSON.stringify(boardToJson(board)) })
    .then((resp): Promise<MctsResponse> => resp.json())
    .then((json) => {
      const { move, winningPercentage, simulationCounter } = json;
      const newBoardAfterAI = makeMoveWithoutCheck(board, move);
      const gameStatus = getGameStatus(newBoardAfterAI);
      let newStatus: GameStatus;
      if (gameStatus === 1) {
        newStatus = 'BLACK_WINS';
      } else if (gameStatus === -1) {
        newStatus = 'WHITE_WINS';
      } else {
        newStatus = 'PLAYER_MOVE';
      }
      return {
        board: newBoardAfterAI,
        highlightedCell: move,
        status: newStatus,
        aiInfo: {
          aiWinningProbability: winningPercentage,
          aiNumberOfSimulations: simulationCounter,
        },
      };
    });

export default function StatefulGameCard(): ReactElement {
  const [gameState, setGameState] = useState(initialGameState);

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
    aiResponder(newBoard).then(setGameState);
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
