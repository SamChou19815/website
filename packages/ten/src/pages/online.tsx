import React, { ReactElement, Suspense, lazy } from 'react';

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

import App from '../components/App';

import './index.css';
import LoadingOverlay from 'lib-react/LoadingOverlay';

// Lazy import is necessary for conditional execution below,
// since firebase/app code cannot be executed in SSR environments.
const FirebaseLoginAppBarrier = lazy(() => import('lib-firebase/FirebaseLoginAppBarrier'));
const OnlineGameWrapper = lazy(() => import('../components/OnlineGameWrapper'));

export default function Online(): ReactElement {
  return (
    <App>
      {ExecutionEnvironment.canUseDOM ? (
        <Suspense fallback={<LoadingOverlay />}>
          <FirebaseLoginAppBarrier>
            <OnlineGameWrapper />
          </FirebaseLoginAppBarrier>
        </Suspense>
      ) : (
        <div />
      )}
    </App>
  );
}
