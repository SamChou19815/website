import React, { lazy } from 'react';

import HeadTitle from 'esbuild-scripts/components/HeadTitle';
import SSRSuspense from 'esbuild-scripts/components/SSRSuspense';
import LoadingOverlay from 'lib-react-loading';

// Lazy import is necessary for conditional execution below,
// since firebase/app code cannot be executed in SSR environments.
const FirebaseLoginAppBarrier = lazy(() => import('lib-firebase/FirebaseLoginAppBarrier'));
const App = lazy(() => import('../app/App'));

export default function InternTierAccessEntryPoint(): JSX.Element {
  return (
    <>
      <HeadTitle title="internals@dev-sam | Wiki" />
      <SSRSuspense fallback={<LoadingOverlay />}>
        <FirebaseLoginAppBarrier>
          <App />
        </FirebaseLoginAppBarrier>
      </SSRSuspense>
    </>
  );
}
