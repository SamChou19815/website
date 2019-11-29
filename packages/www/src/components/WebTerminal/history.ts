/* eslint-disable prefer-destructuring */
import { RefObject } from 'react';
import { TerminalHistory } from './types';

type Result = {
  readonly historyPosition: number | null;
  readonly previousHistoryPosition: number | null;
};

export default (
  direction: 'up' | 'down',
  commandHistory: readonly TerminalHistory[],
  historyPosition: number | null,
  previousHistoryPosition: number | null,
  terminalInput: RefObject<HTMLInputElement>
): Result => {
  // Clean empty items and reverse order to ease position tracking.
  const history = Array.from(commandHistory)
    .filter(({ isCommand }) => isCommand)
    .reverse();
  const position = historyPosition;
  const previousPosition = previousHistoryPosition;
  const termNode = terminalInput.current;
  if (termNode == null) {
    throw new Error();
  }

  if (history.length === 0) {
    return { historyPosition, previousHistoryPosition };
  }
  // Only run if history is non-empty and in use
  switch (direction) {
    case 'up':
      if (position == null) {
        // If at no position, get most recent entry
        termNode.value = history[0].line;
        return { historyPosition: 0, previousHistoryPosition: null };
      }
      if (position + 1 === history.length) {
        // If the first entry will be reached on this press,
        // get it and decrement position by 1 to avoid confusing downscroll.
        termNode.value = history[history.length - 1].line;
        return {
          historyPosition: history.length - 1,
          previousHistoryPosition: history.length - 2
        };
      }
      // Normal increment by one
      termNode.value = history[position + 1].line;
      return { historyPosition: position + 1, previousHistoryPosition: position };
    case 'down':
      if (position == null || !history[position]) {
        // If at initial or out of range, clear (Unix-like behaviour)
        termNode.value = '';
        return { historyPosition: null, previousHistoryPosition: null };
      }
      if (position - 1 === -1) {
        // Clear because user pressed up once and is now pressing down again => clear or is reaching bottom
        if (previousPosition === null || (position === 0 && previousPosition === 1)) {
          termNode.value = '';
        } else {
          termNode.value = history[0].line;
        }
        return { historyPosition: null, previousHistoryPosition: null };
      }
      // Normal decrement by one
      termNode.value = history[position - 1].line;
      return { historyPosition: position - 1, previousHistoryPosition: position };
    default:
      throw new Error();
  }
};
