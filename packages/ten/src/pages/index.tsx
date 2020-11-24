import React, { ReactElement } from 'react';

import App from '../components/App';
import GameCardWithLogic from '../components/GameCardWithLogic';
import { Board, boardToJson, makeMoveWithoutCheck } from '../game/board';
import type { GameState } from '../game/game-state';
import type { MctsResponse } from '../game/mcts';
import './index.css';

const aiResponder = (board: Board): Promise<GameState> =>
  fetch('/api/respond', { method: 'POST', body: JSON.stringify(boardToJson(board)) })
    .then((resp): Promise<MctsResponse> => resp.json())
    .then((json) => {
      const { move, winningPercentage, simulationCounter } = json;
      const newBoardAfterAI = makeMoveWithoutCheck(board, move);
      return {
        board: newBoardAfterAI,
        highlightedCell: move,
        aiInfo: { winningPercentage, simulationCounter },
      };
    });

export default function Index(): ReactElement {
  return (
    <App>
      <GameCardWithLogic otherPlayerResponder={aiResponder} />
    </App>
  );
}
