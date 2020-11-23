import React, { ReactElement } from 'react';

import App from '../components/App';
import GameCardWithLogic from '../components/GameCardWithLogic';
import { Board, boardToJson, getGameStatus, makeMoveWithoutCheck } from '../game/board';
import type { GameState, GameStatus } from '../game/game-state';
import type { MctsResponse } from '../game/mcts';
import './index.css';

const aiResponder = (board: Board): Promise<GameState> =>
  fetch('/api/respond', { method: 'POST', body: JSON.stringify(boardToJson(board)) })
    .then((resp): Promise<MctsResponse> => resp.json())
    .then((json) => {
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
      return {
        board: newBoardAfterAI,
        highlightedCell: move,
        status: newStatus,
        aiInfo: {
          aiWinningProbability: winningPercentage,
          aiNumberOfSimulations: simulationCounter,
        },
      };
    });

export default function Index(): ReactElement {
  return (
    <App>
      <GameCardWithLogic otherPlayerResponder={aiResponder} />
    </App>
  );
}
