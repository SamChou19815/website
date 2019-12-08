/* eslint-disable prefer-destructuring */
import { TerminalHistory } from './types';

type Result = {
  readonly value: string;
  readonly historyPosition: number | null;
  readonly previousHistoryPosition: number | null;
};

export default (
  direction: 'up' | 'down',
  commandHistory: readonly TerminalHistory[],
  historyPosition: number | null,
  previousHistoryPosition: number | null
): Result | null => {
  // Clean empty items and reverse order to ease position tracking.
  const history = Array.from(commandHistory)
    .filter(({ isCommand }) => isCommand)
    .map(item => item.line)
    .reverse();
  if (history.length === 0) {
    return null;
  }

  // Only run if history is non-empty and in use
  switch (direction) {
    case 'up':
      if (historyPosition == null) {
        // If at no position, get most recent entry
        return { value: history[0], historyPosition: 0, previousHistoryPosition: null };
      }
      if (historyPosition + 1 === history.length) {
        // If the first entry will be reached on this press,
        // get it and decrement position by 1 to avoid confusing downscroll.
        return {
          value: history[history.length - 1],
          historyPosition: history.length - 1,
          previousHistoryPosition: history.length - 2
        };
      }
      // Normal increment by one
      return {
        value: history[historyPosition + 1],
        historyPosition: historyPosition + 1,
        previousHistoryPosition: historyPosition
      };
    case 'down':
      if (historyPosition == null || !history[historyPosition]) {
        // If at initial or out of range, clear (Unix-like behaviour)
        return { value: '', historyPosition: null, previousHistoryPosition: null };
      }
      if (historyPosition - 1 === -1) {
        // Clear because user pressed up once and is now pressing down again =>
        // clear or is reaching bottom
        const value =
          previousHistoryPosition === null ||
          (historyPosition === 0 && previousHistoryPosition === 1)
            ? ''
            : history[0];
        return { value, historyPosition: null, previousHistoryPosition: null };
      }
      // Normal decrement by one
      return {
        value: history[historyPosition - 1],
        historyPosition: historyPosition - 1,
        previousHistoryPosition: historyPosition
      };
    default:
      throw new Error();
  }
};
