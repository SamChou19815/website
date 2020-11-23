import React, { ReactElement, Suspense, lazy } from 'react';

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import Layout from '@theme/Layout';

import LoadingOverlay from 'lib-react/LoadingOverlay';

// Lazy import is necessary for conditional execution below,
// since firebase/app code cannot be executed in SSR environments.
const FirebaseLoginAppBarrier = lazy(() => import('../app/FirebaseLoginAppBarrier'));
const App = lazy(() => import('../app/App'));

export default function InternTierAccessEntryPoint(): ReactElement {
  return (
    <Layout title="internals@dev-sam" description="Restricted-access internal portal">
      {ExecutionEnvironment.canUseDOM ? (
        <Suspense fallback={<LoadingOverlay />}>
          <FirebaseLoginAppBarrier>
            <App />
          </FirebaseLoginAppBarrier>
        </Suspense>
      ) : (
        <div />
      )}
    </Layout>
  );
}
