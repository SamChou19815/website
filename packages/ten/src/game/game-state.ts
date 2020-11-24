import type { Board } from './board';

export type GameState = {
  readonly board: Board;
  readonly highlightedCell?: readonly [number, number];
  readonly aiInfo?: { readonly winningPercentage: number; readonly simulationCounter: number };
};

export type GameStates = {
  readonly currentState: GameState;
  readonly previousState?: GameStates;
};
