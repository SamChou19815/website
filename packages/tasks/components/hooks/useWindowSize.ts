import { useState, useEffect } from 'react';

import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

export type WindowSize = { readonly width: number; readonly height: number };

const getWindowSize = (): WindowSize => ({ width: window.innerWidth, height: window.innerHeight });

const windowSizeObservable = fromEvent(window, 'resize').pipe(map(getWindowSize));

const useWindowSize = <T>(tranformer: (windowSize: WindowSize) => T): T => {
  const [mappedValue, setMappedValue] = useState(() => tranformer(getWindowSize()));

  useEffect(() => {
    const unsubscribe = windowSizeObservable.subscribe((windowSize) => {
      setMappedValue(tranformer(windowSize));
    });
    return () => unsubscribe.unsubscribe();
  });

  return mappedValue;
};

export default useWindowSize;
