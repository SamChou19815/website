// @flow strict

import type { Node } from 'react';
import React from 'react';
import StatefulGameCard, { initialGameState } from './StatefulGameCard';
import type { Board } from '../game/board';
import {
  boardToJson,
  getGameStatus,
  makeMoveWithoutCheck,
} from '../game/board';

/**
 * The game card in local mode.
 */
export default function DistributedGameCard(): Node {
  const [gameState, setGameState] = React.useState(initialGameState);

  const aiResponder = (board: Board): void => {
    fetch('/api/respond', { method: 'POST', body: JSON.stringify(boardToJson(board)) })
      .then(resp => resp.json())
      .then((json) => {
        const { move, winningPercentage, simulationCounter } = json;
        const newBoardAfterAI = makeMoveWithoutCheck(board, move);
        const gameStatus = getGameStatus(newBoardAfterAI);
        let newStatus;
        if (gameStatus === 1) {
          newStatus = 'BLACK_WINS';
        } else if (gameStatus === -1) {
          newStatus = 'WHITE_WINS';
        } else {
          newStatus = 'PLAYER_MOVE';
        }
        setGameState({
          board: newBoardAfterAI,
          highlightedCell: move,
          status: newStatus,
          aiInfo: [winningPercentage, simulationCounter],
        });
      });
  };

  return (
    <StatefulGameCard
      gameState={gameState}
      setGameState={setGameState}
      aiResponder={aiResponder}
    />
  );
}
