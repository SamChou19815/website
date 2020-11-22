import React, { ReactElement } from 'react';

import type { Board } from '../game/board';
import type { GameStates } from '../game/game-state';
import BoardGrid from './BoardGrid';
import styles from './GameCard.module.css';

type Props = {
  readonly gameStates: GameStates;
  readonly board: Board;
  readonly clickCallback: (a: number, b: number) => void;
  readonly onSelectSide: (side: 1 | -1) => void;
  readonly onUndoMove: () => void;
};

export default function GameCard({
  gameStates,
  clickCallback,
  onSelectSide,
  onUndoMove,
}: Props): ReactElement {
  const { board, status, highlightedCell, aiInfo } = gameStates.currentState;
  const { tiles, playerIdentity } = board;
  let message: string;
  let blockerActive: boolean;
  let showGameStarterButtons: boolean;
  switch (status) {
    case 'PLAYER_MOVE':
      message = 'Waiting for your move.';
      blockerActive = false;
      showGameStarterButtons = gameStates.previousState == null;
      break;
    case 'ILLEGAL_MOVE':
      message = 'Illegal move!';
      blockerActive = false;
      showGameStarterButtons = false;
      break;
    case 'AI_MOVE':
      message = 'Waiting for AI move.';
      blockerActive = true;
      showGameStarterButtons = false;
      break;
    case 'BLACK_WINS':
      message = 'Black Wins';
      blockerActive = true;
      showGameStarterButtons = true;
      break;
    case 'WHITE_WINS':
      message = 'White Wins';
      blockerActive = true;
      showGameStarterButtons = true;
      break;
    default:
      throw new Error('Bad status!');
  }
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
    <div>
      <div className="card">
        <div className="card__body">{message}</div>
        <div className="card__body">
          {`Your Identity: ${playerIdentity === 1 ? 'Black' : 'White'}`}
        </div>
        {aiInfoNode}
        <div className={`card__body ${styles.GameCells}`}>
          {blockerActive && <div className={styles.Overlay} />}
          <BoardGrid
            tiles={tiles}
            highlightedCell={highlightedCell}
            clickCallback={clickCallback}
          />
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
        {(status === 'PLAYER_MOVE' || status === 'ILLEGAL_MOVE') &&
          gameStates.previousState != null && (
            <div className="card__footer">
              <button className="button button--outline button--primary" onClick={onUndoMove}>
                Undo your last move
              </button>
            </div>
          )}
      </div>
      <div className="card">
        <div className="card__header">Rules</div>
        <div className="card__body">
          The rules are mostly the same with the original&nbsp;
          <a href="https://en.wikipedia.org/wiki/Ultimate_tic-tac-toe">
            TEN game (Ultimate tic-tac-toe)
          </a>
          , except that a draw is a win for white in this game. AI thinking time is 1.5s.
        </div>
      </div>
    </div>
  );
}
