import { useState, useEffect } from 'react';

export type WindowSize = { readonly width: number; readonly height: number };
type Listener = (windowSize: WindowSize) => void;

const getWindowSize = (): WindowSize => {
  if (!process.browser) {
    return { width: 1024, height: 768 };
  }
  return {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  };
};

let cachedWindowSize: WindowSize = { width: 0, height: 0 };
let hasUnreportedChange = false;
const listeners = new Map<number, Listener>();
let listenerSize = 0;

const windowSizeListener = (): void => {
  const newSize = getWindowSize();
  if (newSize.width === cachedWindowSize.width && newSize.height === cachedWindowSize.height) {
    return;
  }
  cachedWindowSize = newSize;
  hasUnreportedChange = true;
};

const notifyAll = (): void => {
  if (hasUnreportedChange) {
    listeners.forEach((l) => l(cachedWindowSize));
    hasUnreportedChange = false;
  }
};

const bindListener = (listener: Listener): (() => void) => {
  const id = listenerSize;
  listeners.set(id, listener);
  listenerSize += 1;
  return () => {
    listeners.delete(id);
  };
};

export const initializeWindowSizeHooksListeners = (): void => {
  window.addEventListener('resize', windowSizeListener);
  setInterval(notifyAll, 100);
};

/**
 * A hook for window size.
 */
export function useWindowSize(): WindowSize {
  const [size, setSize] = useState(getWindowSize);
  useEffect(() => bindListener(setSize), []);
  return size;
}
