import React, { useState } from 'react';
import GameCard from '../components/GameCard';
import { Board, emptyBoard, makeMove, Move } from '../game/board';
import type { GameStates } from '../game/game-state';

const initialState: GameStates = { currentState: { board: emptyBoard } };

export default function LocalGameCard(): JSX.Element {
  const [gameStates, setGameStates] = useState<GameStates>(initialState);
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
      playerCanMove
      playerMadeIllegalMove={playerMadeIllegalMove}
      showUndoButton={gameStates.previousState != null}
      clickCallback={(a, b) => clickCellCallback(gameStates.currentState.board, [a, b])}
      onUndoMove={() => {
        setGameStates(({ previousState }) => previousState ?? initialState);
      }}
    />
  );
}
