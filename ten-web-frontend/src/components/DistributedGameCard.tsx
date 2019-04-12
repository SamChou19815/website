import React, { ReactElement } from 'react';
import StatefulGameCard, { initialGameState } from './StatefulGameCard';
import { Board, boardToJson, getGameStatus, makeMoveWithoutCheck } from '../game/board';
import { Status } from './GameCard';
import { MctsResponse } from '../game/mcts';

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
        let newStatus: Status;
        if (gameStatus === 1) {
          newStatus = 'BLACK_WINS';
        } else if (gameStatus === -1) {
          newStatus = 'WHITE_WINS';
        } else {
          newStatus = 'PLAYER_MOVE';
        }
        const aiInfo: [number, number] = [winningPercentage, simulationCounter];
        setGameState({
          board: newBoardAfterAI,
          highlightedCell: move,
          status: newStatus,
          aiInfo,
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
