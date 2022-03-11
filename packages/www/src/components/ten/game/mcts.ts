import type { Move } from './board';

export type MctsResponse = {
  readonly move: Move;
  readonly winningPercentage: number;
  readonly simulationCounter: number;
};
