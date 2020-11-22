import React, { ReactElement } from 'react';

import { Board, boardToJson, getGameStatus, makeMoveWithoutCheck } from '../game/board';
import type { GameStatus } from '../game/game-state';
import type { MctsResponse } from '../game/mcts';
import StatefulGameCard, { initialGameState } from './StatefulGameCard';

/**
 * The game card in local mode.
 */
export default function DistributedGameCard(): ReactElement {
  const [gameState, setGameState] = React.useState(initialGameState);

  const aiResponder = (board: Board): void => {
    fetch('/api/respond', { method: 'POST', body: JSON.stringify(boardToJson(board)) })
      .then((resp): Promise<MctsResponse> => resp.json())
      .then((json): void => {
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
        setGameState({
          board: newBoardAfterAI,
          highlightedCell: move,
          status: newStatus,
          aiInfo: {
            aiWinningProbability: winningPercentage,
            aiNumberOfSimulations: simulationCounter,
          },
        });
      });
  };

  return (
    <StatefulGameCard gameState={gameState} setGameState={setGameState} aiResponder={aiResponder} />
  );
}
