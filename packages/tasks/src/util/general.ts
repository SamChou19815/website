/** The identity function. */
export const identity = <T>(t: T): T => t;

/** An empty function used to ignore promise. */
export const ignore = (): void => {};

/**
 * Throw an error. Useful when want to use this as an expression.
 *
 * @param message an optional message.
 */
export const error = (message?: string): never => {
  throw new Error(message);
};
