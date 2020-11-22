import type { Board } from './board';

export type GameStatus = 'PLAYER_MOVE' | 'ILLEGAL_MOVE' | 'AI_MOVE' | 'BLACK_WINS' | 'WHITE_WINS';

export type GameState = {
  readonly board: Board;
  readonly status: GameStatus;
  readonly highlightedCell?: readonly [number, number];
  readonly aiInfo?: {
    readonly aiWinningProbability: number;
    readonly aiNumberOfSimulations: number;
  };
};
