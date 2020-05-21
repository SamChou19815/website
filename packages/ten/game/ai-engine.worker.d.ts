import { Board } from './board';
import { MctsResponse } from './mcts';

type EventType = { data: { aiResponse: MctsResponse; board: Board } };

declare class AIEngineWorker {
  public postMessage: (board: Board) => void;

  public addEventListener: (type: 'message', listener: (event: EventType) => void) => void;
}

export default AIEngineWorker;
