import React, { ReactElement, Suspense, lazy } from 'react';

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

import App from '../components/App';
import GameCardWithLogic from '../components/GameCardWithLogic';

import './index.css';
import LoadingOverlay from 'lib-react/LoadingOverlay';

// Lazy import is necessary for conditional execution below,
// since firebase/app code cannot be executed in SSR environments.
const FirebaseLoginAppBarrier = lazy(() => import('../components/FirebaseLoginBarrier'));

export default function Online(): ReactElement {
  return (
    <App>
      {ExecutionEnvironment.canUseDOM ? (
        <Suspense fallback={<LoadingOverlay />}>
          <FirebaseLoginAppBarrier>
            <GameCardWithLogic />
          </FirebaseLoginAppBarrier>
        </Suspense>
      ) : (
        <div />
      )}
    </App>
  );
}
