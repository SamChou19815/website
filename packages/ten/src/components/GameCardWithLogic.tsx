import React, { ReactElement, useState } from 'react';

import {
  Move,
  Board,
  emptyBoard,
  getGameStatus,
  makeMove,
  makeMoveWithoutCheck,
} from '../game/board';
import type { GameState, GameStates } from '../game/game-state';
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

type Props = {
  readonly initialBoard?: Board;
  readonly showGameStarterButtons?: boolean;
  readonly otherPlayerResponder?: (board: Board, move: Move) => Promise<GameState>;
};

export default function GameCardWithLogic({
  initialBoard = emptyBoard,
  showGameStarterButtons,
  otherPlayerResponder,
}: Props): ReactElement {
  const [gameStates, setGameStates] = useState<GameStates>({
    currentState: { board: initialBoard },
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
      currentState: { board: newBoard, highlightedCell: move },
    }));
    if (otherPlayerResponder == null) return;
    setPlayerCanMove(false);
    otherPlayerResponder(newBoard, move).then((currentState) => {
      setPlayerCanMove(true);
      setGameStates((previousState) => ({ ...previousState, currentState }));
    });
  };

  return (
    <GameCard
      gameState={gameStates.currentState}
      playerCanMove={playerCanMove}
      playerMadeIllegalMove={playerMadeIllegalMove}
      showGameStarterButtons={
        showGameStarterButtons ?? computeCanShowGameStarterButtons(gameStates, playerCanMove)
      }
      showUndoButton={playerCanMove && gameStates.previousState != null}
      clickCallback={(a, b) => clickCellCallback(gameStates.currentState.board, [a, b])}
      onSelectSide={(id) => {
        const newBoard = id === 1 ? emptyBoard : makeMoveWithoutCheck(emptyBoard, [4, 4]);
        setGameStates({ currentState: { board: newBoard } });
      }}
      onUndoMove={() => {
        setGameStates((currentState) => checkNotNull(currentState.previousState));
      }}
    />
  );
}
