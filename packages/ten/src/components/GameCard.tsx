import React, { ReactElement } from 'react';

import type { GameState, GameStatus } from '../game/game-state';
import BoardGrid from './BoardGrid';
import styles from './GameCard.module.css';

const getMessage = (status: GameStatus): string => {
  switch (status) {
    case 'PLAYER_MOVE':
      return 'Waiting for your move.';
    case 'ILLEGAL_MOVE':
      return 'Illegal move!';
    case 'AI_MOVE':
      return 'Waiting for AI move.';
    case 'BLACK_WINS':
      return 'Black Wins';
    case 'WHITE_WINS':
      return 'White Wins';
  }
};

const computeIsBlockerActive = (status: GameStatus): boolean => {
  switch (status) {
    case 'PLAYER_MOVE':
    case 'ILLEGAL_MOVE':
      return false;
    case 'AI_MOVE':
    case 'BLACK_WINS':
    case 'WHITE_WINS':
      return true;
  }
};

type Props = {
  readonly gameState: GameState;
  readonly showGameStarterButtons: boolean;
  readonly showUndoButton: boolean;
  readonly clickCallback: (a: number, b: number) => void;
  readonly onSelectSide: (side: 1 | -1) => void;
  readonly onUndoMove: () => void;
};

export default function GameCard({
  gameState: { board, status, highlightedCell, aiInfo },
  showGameStarterButtons,
  showUndoButton,
  clickCallback,
  onSelectSide,
  onUndoMove,
}: Props): ReactElement {
  const { tiles, playerIdentity } = board;
  let aiInfoNode: ReactElement | null;
  if (aiInfo == null) {
    aiInfoNode = null;
  } else {
    const { aiWinningProbability, aiNumberOfSimulations } = aiInfo;
    aiInfoNode = (
      <div className="card__body">
        {`AI Winning Probability ${aiWinningProbability}%. Number of Simulations Run: ${aiNumberOfSimulations}.`}
      </div>
    );
  }
  return (
    <div className="card">
      <div className="card__body">{getMessage(status)}</div>
      <div className="card__body">
        {`Your Identity: ${playerIdentity === 1 ? 'Black' : 'White'}`}
      </div>
      {aiInfoNode}
      <div className={`card__body ${styles.GameCells}`}>
        {computeIsBlockerActive(status) && <div className={styles.Overlay} />}
        <BoardGrid tiles={tiles} highlightedCell={highlightedCell} clickCallback={clickCallback} />
      </div>
      {showGameStarterButtons && (
        <div className="card__footer">
          <button
            className="button button--outline button--primary"
            onClick={() => onSelectSide(1)}
          >
            Play as Black
          </button>
          <button
            className="button button--outline button--primary"
            onClick={() => onSelectSide(-1)}
          >
            Play as White
          </button>
        </div>
      )}
      {showUndoButton && (
        <div className="card__footer">
          <button className="button button--outline button--primary" onClick={onUndoMove}>
            Undo your last move
          </button>
        </div>
      )}
    </div>
  );
}
