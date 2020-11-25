import React, { ReactElement, ReactNode } from 'react';

import { Board, getGameStatus } from '../game/board';
import type { GameState } from '../game/game-state';
import BoardGrid from './BoardGrid';
import styles from './GameCard.module.css';

const getMessage = (
  board: Board,
  playerCanMove: boolean,
  playerMadeIllegalMove: boolean
): string => {
  switch (getGameStatus(board)) {
    case 0:
      if (!playerCanMove) {
        return 'Waiting for AI move.';
      }
      return playerMadeIllegalMove ? 'Illegal move!' : 'Waiting for your move.';
    case 1:
      return 'Black Wins';
    case -1:
      return 'White Wins';
  }
};

type Props = {
  readonly gameState: GameState;
  readonly playerIdentity: 'Black' | 'White';
  readonly playerCanMove: boolean;
  readonly playerMadeIllegalMove: boolean;
  readonly showUndoButton: boolean;
  readonly children?: ReactNode;
  readonly clickCallback: (a: number, b: number) => void;
  readonly onUndoMove?: () => void;
};

export default function GameCard({
  gameState: { board, aiInfo },
  playerIdentity,
  playerCanMove,
  playerMadeIllegalMove,
  showUndoButton,
  children,
  clickCallback,
  onUndoMove,
}: Props): ReactElement {
  const { tiles } = board;
  let aiInfoNode: ReactElement | null;
  if (aiInfo == null) {
    aiInfoNode = null;
  } else {
    const { winningPercentage, simulationCounter } = aiInfo;
    aiInfoNode = (
      <div className="card__body">
        {`AI Winning Probability ${winningPercentage}%. Number of Simulations Run: ${simulationCounter}.`}
      </div>
    );
  }
  return (
    <div className="card">
      <div className="card__body">{getMessage(board, playerCanMove, playerMadeIllegalMove)}</div>
      <div className="card__body">{`Your Identity: ${playerIdentity}`}</div>
      {aiInfoNode}
      <div className={`card__body ${styles.GameCells}`}>
        {!playerCanMove && <div className={styles.Overlay} />}
        <BoardGrid tiles={tiles} lastMove={board.lastMove} clickCallback={clickCallback} />
      </div>
      {children}
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
