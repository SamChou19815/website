import React, { ReactElement, useState } from 'react';

import {
  Move,
  Board,
  emptyBoard,
  getGameStatus,
  makeMove,
  makeMoveWithoutCheck,
  boardToJson,
} from '../game/board';
import type { GameState, GameStates } from '../game/game-state';
import type { MctsResponse } from '../game/mcts';
import GameCard from './GameCard';

import { checkNotNull } from 'lib-common';

const computeCanShowGameStarterButtons = (
  gameStates: GameStates,
  playerCanMove: boolean
): boolean => {
  switch (getGameStatus(gameStates.currentState.board)) {
    case 0:
      if (playerCanMove) return gameStates.previousState == null;
      return false;
    case 1:
    case -1:
      return true;
  }
};

const aiResponder = (board: Board): Promise<GameState> =>
  fetch('/api/respond', { method: 'POST', body: JSON.stringify(boardToJson(board)) })
    .then((resp): Promise<MctsResponse> => resp.json())
    .then((json) => {
      const { move, winningPercentage, simulationCounter } = json;
      const newBoardAfterAI = makeMoveWithoutCheck(board, move);
      return { board: newBoardAfterAI, aiInfo: { winningPercentage, simulationCounter } };
    });

export default function GameCardWithLogic(): ReactElement {
  const [gameStates, setGameStates] = useState<GameStates>({
    currentState: { board: emptyBoard },
  });
  const [playerCanMove, setPlayerCanMove] = useState(true);
  const [playerMadeIllegalMove, setPlayerMadeIllegalMove] = useState(false);

  const clickCellCallback = (board: Board, move: Move): void => {
    const newBoard = makeMove(board, move);
    if (newBoard === null) {
      setPlayerMadeIllegalMove(true);
      return;
    }
    setPlayerMadeIllegalMove(false);
    setGameStates((previousState) => ({
      previousState,
      currentState: { board: newBoard },
    }));
    setPlayerCanMove(false);
    aiResponder(newBoard).then((currentState) => {
      setPlayerCanMove(true);
      setGameStates((previousState) => ({ ...previousState, currentState }));
    });
  };

  const onSelectSide = (id: 1 | -1) => {
    const newBoard = id === 1 ? emptyBoard : makeMoveWithoutCheck(emptyBoard, [4, 4]);
    setGameStates({ currentState: { board: newBoard } });
  };

  return (
    <GameCard
      gameState={gameStates.currentState}
      playerCanMove={playerCanMove}
      playerMadeIllegalMove={playerMadeIllegalMove}
      showUndoButton={playerCanMove && gameStates.previousState != null}
      clickCallback={(a, b) => clickCellCallback(gameStates.currentState.board, [a, b])}
      onUndoMove={() => {
        setGameStates((currentState) => checkNotNull(currentState.previousState));
      }}
    >
      {computeCanShowGameStarterButtons(gameStates, playerCanMove) && (
        <div className="card__footer">
          <button
            className="button button--outline button--primary"
            onClick={() => onSelectSide(1)}
          >
            Play as Black
          </button>
          <button
            className="button button--outline button--primary"
            onClick={() => onSelectSide(-1)}
          >
            Play as White
          </button>
        </div>
      )}
    </GameCard>
  );
}
