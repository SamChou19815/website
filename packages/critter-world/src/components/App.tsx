/* eslint-disable no-await-in-loop */
import React, { ReactElement, useState, useEffect } from 'react';

import { sendGetWorldRequest } from '../utils/http';
import DataLoadedApp from './DataLoadedApp';

import LoadingOverlay from 'lib-react/LoadingOverlay';

const wait = (time: number): Promise<void> =>
  new Promise((resolve) => setTimeout(() => resolve(), time));

const recurringRefetchWorldState = (setWorldState: (s: WorldState) => void): (() => void) => {
  let continueToRefresh = true;

  (async () => {
    while (continueToRefresh) {
      try {
        const newWorldState: WorldState = await sendGetWorldRequest();
        setWorldState(newWorldState);
        await wait(30);
      } catch {
        await wait(1000);
      }
    }
  })();

  return (): void => {
    continueToRefresh = false;
  };
};

const App = (): ReactElement => {
  const [worldState, setWorldState] = useState<WorldState | null>(null);
  useEffect(() => recurringRefetchWorldState(setWorldState), []);

  if (worldState == null) return <LoadingOverlay />;
  return <DataLoadedApp worldState={worldState} />;
};

export default App;
