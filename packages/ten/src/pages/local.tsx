import { checkNotNull } from 'lib-common';
import React, { useState } from 'react';

import GameCard from '../components/GameCard';
import { Move, Board, emptyBoard, makeMove } from '../game/board';

import type { GameStates } from '../game/game-state';

export default function LocalGameCard(): JSX.Element {
  const [gameStates, setGameStates] = useState<GameStates>({ currentState: { board: emptyBoard } });
  const [playerMadeIllegalMove, setPlayerMadeIllegalMove] = useState(false);

  const clickCellCallback = (board: Board, move: Move): void => {
    const newBoard = makeMove(board, move);
    if (newBoard === null) {
      setPlayerMadeIllegalMove(true);
      return;
    }
    setPlayerMadeIllegalMove(false);
    setGameStates((previousState) => ({ previousState, currentState: { board: newBoard } }));
  };

  return (
    <GameCard
      gameState={gameStates.currentState}
      playerIdentity={gameStates.currentState.board.playerIdentity === 1 ? 'Black' : 'White'}
      playerCanMove
      playerMadeIllegalMove={playerMadeIllegalMove}
      showUndoButton={gameStates.previousState != null}
      clickCallback={(a, b) => clickCellCallback(gameStates.currentState.board, [a, b])}
      onUndoMove={() => {
        setGameStates((currentState) => checkNotNull(currentState.previousState));
      }}
    />
  );
}
