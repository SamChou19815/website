type Result = {
  readonly value: string;
  readonly historyPosition: number | null;
};

const checkNotNull = (v: string | undefined): string => {
  if (v == null) throw new Error();
  return v;
};

const scrollHistory = (
  direction: 'up' | 'down',
  history: readonly string[],
  historyPosition?: number | null
): Result | null => {
  if (history.length === 0) {
    return null;
  }

  // Only run if history is non-empty and in use
  switch (direction) {
    case 'up':
      if (historyPosition == null) {
        // If at no position, get most recent entry
        return { value: checkNotNull(history[0]), historyPosition: 0 };
      }
      if (historyPosition + 1 === history.length) {
        // If the first entry will be reached on this press,
        // get it and decrement position by 1 to avoid confusing downscroll.
        return {
          value: checkNotNull(history[history.length - 1]),
          historyPosition: history.length - 1,
        };
      }
      // Normal increment by one
      return {
        value: checkNotNull(history[historyPosition + 1]),
        historyPosition: historyPosition + 1,
      };
    case 'down':
      if (historyPosition == null || historyPosition === 0) {
        // If at initial or will be out of range, clear (Unix-like behaviour)
        return { value: '', historyPosition: null };
      }
      // Normal decrement by one
      return {
        value: checkNotNull(history[historyPosition - 1]),
        historyPosition: historyPosition - 1,
      };
    default:
      throw new Error();
  }
};

export default scrollHistory;
