import React, { ReactElement, useState } from 'react';

import { Move, Board, emptyBoard, makeMove } from '../game/board';
import type { GameState, GameStates } from '../game/game-state';
import GameCard from './GameCard';

import { checkNotNull } from 'lib-common';

type Props = {
  readonly initialBoard?: Board;
  readonly showGameStarterButtons?: boolean;
  readonly otherPlayerResponder?: (board: Board) => Promise<GameState>;
};

export default function GameCardWithLogic({
  initialBoard = emptyBoard,
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
      currentState: { board: newBoard },
    }));
    if (otherPlayerResponder == null) return;
    setPlayerCanMove(false);
    otherPlayerResponder(newBoard).then((currentState) => {
      setPlayerCanMove(true);
      setGameStates((previousState) => ({ ...previousState, currentState }));
    });
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
    />
  );
}
