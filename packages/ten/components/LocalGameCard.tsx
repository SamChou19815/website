import React, { ReactElement } from 'react';

import AIEngineWorker from '../game/ai-engine.worker';
import { getGameStatus, makeMoveWithoutCheck, Board } from '../game/board';
import { MctsResponse } from '../game/mcts';
import { Status } from './GameCard';
import StatefulGameCard, { initialGameState } from './StatefulGameCard';

/** The game card in local mode */
export default function LocalGameCard(): ReactElement {
  const [gameState, setGameState] = React.useState(initialGameState);
  const [isWorkerListenerSet, setIsWorkerListenerSet] = React.useState(false);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const workerRef = React.useRef<AIEngineWorker>(undefined!);

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
    workerRef.current.postMessage(b);
  };

  React.useEffect((): void => {
    if (!isWorkerListenerSet) {
      const worker = new AIEngineWorker();
      workerRef.current = worker;
      worker.addEventListener('message', aiResponseListener);
      setIsWorkerListenerSet(true);
    }
  }, [isWorkerListenerSet]);

  return (
    <StatefulGameCard gameState={gameState} setGameState={setGameState} aiResponder={aiResponder} />
  );
}
