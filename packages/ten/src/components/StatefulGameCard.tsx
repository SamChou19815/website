import React, { ReactElement, useState } from 'react';

import {
  Move,
  Board,
  emptyBoard,
  getGameStatus,
  makeMove,
  makeMoveWithoutCheck,
} from '../game/board';
import type { GameState, GameStates, GameStatus } from '../game/game-state';
import GameCard from './GameCard';

import { checkNotNull } from 'lib-common';

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

type Props = {
  readonly initialGameState: GameState;
  readonly otherPlayerResponder: (board: Board) => Promise<GameState>;
};

export default function StatefulGameCard({
  initialGameState,
  otherPlayerResponder,
}: Props): ReactElement {
  const [gameStates, setGameStates] = useState<GameStates>({ currentState: initialGameState });

  const clickCellCallback = (board: Board, move: Move): void => {
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

  return (
    <GameCard
      gameState={gameStates.currentState}
      showGameStarterButtons={computeCanShowGameStarterButtons(gameStates)}
      showUndoButton={
        (gameStates.currentState.status === 'PLAYER_MOVE' ||
          gameStates.currentState.status === 'ILLEGAL_MOVE') &&
        gameStates.previousState != null
      }
      clickCallback={(a, b) => clickCellCallback(gameStates.currentState.board, [a, b])}
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
