import React, { ReactElement } from 'react';

import { emptyBoard, makeMoveWithoutCheck } from '../game/board';
import type { GameState } from '../game/game-state';
import styles from './LocalGameCards.module.css';
import StatefulGameCard from './StatefulGameCard';

const initialBlackGameState: GameState = { board: emptyBoard, status: 'PLAYER_MOVE' };

export default function LocalGameCards(): ReactElement {
  const otherPlayerResponder = async (): Promise<GameState> => {
    throw new Error();
  };

  return (
    <div className={styles.LocalGameCardsContainer}>
      <StatefulGameCard
        initialGameState={initialBlackGameState}
        otherPlayerResponder={otherPlayerResponder}
      />
      <StatefulGameCard
        initialGameState={{
          board: makeMoveWithoutCheck(initialBlackGameState.board, [4, 4]),
          status: 'PLAYER_MOVE',
        }}
        otherPlayerResponder={otherPlayerResponder}
      />
    </div>
  );
}
