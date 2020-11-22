import React, { ReactElement, Dispatch, SetStateAction, useState } from 'react';

import {
  Move,
  Board,
  emptyBoard,
  boardToJson,
  getGameStatus,
  makeMove,
  makeMoveWithoutCheck,
} from '../game/board';
import type { GameState, GameStates, GameStatus } from '../game/game-state';
import type { MctsResponse } from '../game/mcts';
import GameCard from './GameCard';

import { checkNotNull } from 'lib-common';

const initialGameState: GameState = { board: emptyBoard, status: 'PLAYER_MOVE' };

const computeCanShowGameStarterButtons = (gameStates: GameStates): boolean => {
  switch (gameStates.currentState.status) {
    case 'PLAYER_MOVE':
      return gameStates.previousState == null;
    case 'ILLEGAL_MOVE':
    case 'AI_MOVE':
      return false;
    case 'BLACK_WINS':
    case 'WHITE_WINS':
      return true;
  }
};

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

const clickCellCallback = (
  board: Board,
  move: Move,
  setGameStates: Dispatch<SetStateAction<GameStates>>,
  otherPlayerResponder: (b: Board) => Promise<GameState>
): void => {
  const newBoard = makeMove(board, move);
  if (newBoard === null) {
    setGameStates((previousState) => ({
      ...previousState,
      currentState: { ...previousState.currentState, status: 'ILLEGAL_MOVE' },
    }));
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
  setGameStates((previousState) => ({
    previousState: {
      ...previousState,
      currentState: { ...previousState.currentState, status: 'PLAYER_MOVE' },
    },
    currentState: { board: newBoard, highlightedCell: move, status: newStatus },
  }));
  otherPlayerResponder(newBoard).then((currentState) =>
    setGameStates((previousState) => ({ ...previousState, currentState }))
  );
};

export default function StatefulGameCard(): ReactElement {
  const [gameStates, setGameStates] = useState<GameStates>({ currentState: initialGameState });

  return (
    <GameCard
      gameState={gameStates.currentState}
      showGameStarterButtons={computeCanShowGameStarterButtons(gameStates)}
      showUndoButton={
        (gameStates.currentState.status === 'PLAYER_MOVE' ||
          gameStates.currentState.status === 'ILLEGAL_MOVE') &&
        gameStates.previousState != null
      }
      clickCallback={(a, b) =>
        clickCellCallback(gameStates.currentState.board, [a, b], setGameStates, aiResponder)
      }
      onSelectSide={(id) => {
        const newBoard = id === 1 ? emptyBoard : makeMoveWithoutCheck(emptyBoard, [4, 4]);
        setGameStates({ currentState: { board: newBoard, status: 'PLAYER_MOVE' } });
      }}
      onUndoMove={() => {
        setGameStates((currentState) => checkNotNull(currentState.previousState));
      }}
    />
  );
}
