import React, { useState } from 'react';

import GameCard from '../components/GameCard';
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
  fetch('https://us-central1-developer-sam.cloudfunctions.net/HandleTenAIMoveRequest', {
    method: 'POST',
    body: JSON.stringify(boardToJson(board)),
  })
    .then((resp): Promise<MctsResponse> => resp.json())
    .then((json) => {
      const { move, winningPercentage, simulationCounter } = json;
      const newBoardAfterAI = makeMoveWithoutCheck(board, move);
      return { board: newBoardAfterAI, aiInfo: { winningPercentage, simulationCounter } };
    });

export default function PlayAgainstAIGameCard(): JSX.Element {
  const [gameStates, setGameStates] = useState<GameStates>({
    currentState: { board: emptyBoard },
  });
  const [playerIdentity, setPlayerIdentity] = useState<'Black' | 'White'>('Black');
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

  const onSelectSide = (id: 'Black' | 'White') => {
    const newBoard = id === 'Black' ? emptyBoard : makeMoveWithoutCheck(emptyBoard, [4, 4]);
    setPlayerIdentity(id);
    setGameStates({ currentState: { board: newBoard } });
  };

  return (
    <GameCard
      gameState={gameStates.currentState}
      playerIdentity={playerIdentity}
      playerCanMove={playerCanMove && getGameStatus(gameStates.currentState.board) === 0}
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
            onClick={() => onSelectSide('Black')}
          >
            Play as Black
          </button>
          <button
            className="button button--outline button--primary"
            onClick={() => onSelectSide('White')}
          >
            Play as White
          </button>
        </div>
      )}
    </GameCard>
  );
}
