import React, { ReactElement } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import { Board } from '../game/board';
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
      <CardContent>
        {`AI Winning Probability ${prob}%. Number of Simulations Run: ${count}.`}
      </CardContent>
    );
  }
  return (
    <div>
      <Card className={styles.GameCard}>
        <CardContent>{message}</CardContent>
        <CardContent>{`Your Identity: ${playerIdentity === 1 ? 'Black' : 'White'}`}</CardContent>
        {aiInfoNode}
        <CardContent className={styles.GameCells}>
          {blockerActive && <div className={styles.Overlay} />}
          <BoardGrid
            tiles={tiles}
            highlightedCell={highlightedCell}
            clickCallback={clickCallback}
          />
        </CardContent>
        <CardActions className={styles.GameCardControls}>
          <span className={styles.GameCardControlsText}>New Game</span>
          <Button size="small" color="primary" onClick={(): void => onSelectSide(1)}>
            Play as Black
          </Button>
          <Button size="small" color="primary" onClick={(): void => onSelectSide(-1)}>
            Play as White
          </Button>
        </CardActions>
      </Card>
      <Card className={styles.GameCard}>
        <CardHeader title="Note" />
        <CardContent>
          The rules are mostly the same with the original&nbsp;
          <a
            href="https://en.wikipedia.org/wiki/Ultimate_tic-tac-toe"
            target="_blank"
            rel="noopener noreferrer"
          >
            TEN game (Ultimate tic-tac-toe)
          </a>
          , except that a draw is a win for white in this game. AI thinking time is 1.5s.
        </CardContent>
      </Card>
    </div>
  );
}
