import React, { useState } from 'react';
import Button from '../components/Button';
import GameCard from '../components/GameCard';
import {
  Board,
  boardToJson,
  emptyBoard,
  getGameStatus,
  makeMove,
  makeMoveWithoutCheck,
  Move,
} from '../game/board';
import type { GameState, GameStates } from '../game/game-state';
import type { MctsResponse } from '../game/mcts';

function computeCanShowGameStarterButtons(gameStates: GameStates, playerCanMove: boolean): boolean {
  switch (getGameStatus(gameStates.currentState.board)) {
    case 0:
      if (playerCanMove) return gameStates.previousState == null;
      return false;
    case 1:
    case -1:
      return true;
  }
}

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

const initialState: GameStates = { currentState: { board: emptyBoard } };

export default function PlayAgainstAIGameCard(): JSX.Element {
  const [gameStates, setGameStates] = useState<GameStates>(initialState);
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
    setGameStates({ currentState: { board: newBoard } });
  };

  return (
    <GameCard
      gameState={gameStates.currentState}
      playerCanMove={playerCanMove && getGameStatus(gameStates.currentState.board) === 0}
      playerMadeIllegalMove={playerMadeIllegalMove}
      showUndoButton={playerCanMove && gameStates.previousState != null}
      clickCallback={(a, b) => clickCellCallback(gameStates.currentState.board, [a, b])}
      onUndoMove={() => {
        setGameStates(({ previousState }) => previousState ?? initialState);
      }}
    >
      {computeCanShowGameStarterButtons(gameStates, playerCanMove) && (
        <div className="flex items-center justify-center p-4 pt-0">
          <Button onClick={() => onSelectSide('Black')}>Play as Black</Button>
          <Button onClick={() => onSelectSide('White')}>Play as White</Button>
        </div>
      )}
    </GameCard>
  );
}
