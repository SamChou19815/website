import React, { ReactElement } from 'react';

import AIEngineWorker from '../game/ai-engine.worker';
import { getGameStatus, makeMoveWithoutCheck, Board } from '../game/board';
import { MctsResponse } from '../game/mcts';
import { Status } from './GameCard';
import StatefulGameCard, { initialGameState } from './StatefulGameCard';

const worker = new AIEngineWorker();

/**
 * The game card in local mode.
 */
export default function LocalGameCard(): ReactElement {
  const [gameState, setGameState] = React.useState(initialGameState);
  const [isWorkerListenerSet, setIsWorkerListenerSet] = React.useState(false);

  const aiResponseListener = (event: {
    data: { aiResponse: MctsResponse; board: Board };
  }): void => {
    const { aiResponse, board } = event.data;
    const { move, winningPercentage, simulationCounter } = aiResponse;
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
    setGameState({
      board: newBoardAfterAI,
      highlightedCell: move,
      status: newStatus,
      aiInfo: [winningPercentage, simulationCounter],
    });
  };

  const aiResponder = (b: Board): void => {
    worker.postMessage(b); // lgtm [js/property-access-on-non-object]
  };

  React.useEffect((): void => {
    if (!isWorkerListenerSet) {
      worker.addEventListener('message', aiResponseListener); // lgtm [js/property-access-on-non-object]
      setIsWorkerListenerSet(true);
    }
  }, [isWorkerListenerSet]);

  return (
    <StatefulGameCard gameState={gameState} setGameState={setGameState} aiResponder={aiResponder} />
  );
}
