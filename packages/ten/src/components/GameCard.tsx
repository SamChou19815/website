import React, { ReactElement } from 'react';

import type { Board } from '../game/board';
import BoardGrid from './BoardGrid';
import styles from './GameCard.module.css';

export type Status = 'PLAYER_MOVE' | 'ILLEGAL_MOVE' | 'AI_MOVE' | 'BLACK_WINS' | 'WHITE_WINS';

type Props = {
  readonly board: Board;
  readonly clickCallback: (a: number, b: number) => void;
  readonly onSelectSide: (side: 1 | -1) => void;
  readonly status: Status;
  readonly highlightedCell: [number, number] | null;
  readonly aiInfo: [number, number] | null;
};

/**
 * The presentational game card.
 *
 * @param {Props} props all the props.
 * @return {Node} the rendered node.
 * @constructor
 */
export default function GameCard(props: Props): ReactElement {
  const { board, clickCallback, onSelectSide, status, highlightedCell, aiInfo } = props;
  const { tiles, playerIdentity } = board;
  let message: string;
  let blockerActive: boolean;
  switch (status) {
    case 'PLAYER_MOVE':
      message = 'Waiting for your move.';
      blockerActive = false;
      break;
    case 'ILLEGAL_MOVE':
      message = 'Illegal move!';
      blockerActive = false;
      break;
    case 'AI_MOVE':
      message = 'Waiting for AI move.';
      blockerActive = true;
      break;
    case 'BLACK_WINS':
      message = 'Black Wins';
      blockerActive = true;
      break;
    case 'WHITE_WINS':
      message = 'White Wins';
      blockerActive = true;
      break;
    default:
      throw new Error('Bad status!');
  }
  let aiInfoNode: ReactElement | null;
  if (aiInfo === null) {
    aiInfoNode = null;
  } else {
    const [prob, count] = aiInfo;
    aiInfoNode = (
      <div className="card__body">
        {`AI Winning Probability ${prob}%. Number of Simulations Run: ${count}.`}
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
        <div className="card__footer">
          <button
            className="button button--outline button--primary"
            onClick={(): void => onSelectSide(1)}
          >
            Play as Black
          </button>
          <button
            className="button button--outline button--primary"
            onClick={(): void => onSelectSide(-1)}
          >
            Play as White
          </button>
        </div>
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
