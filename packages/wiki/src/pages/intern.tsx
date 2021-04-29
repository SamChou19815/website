import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import Layout from '@theme/Layout';
import React, { ReactElement, Suspense, lazy } from 'react';

import LoadingOverlay from 'lib-react/LoadingOverlay';

import '../css/app.css';

// Lazy import is necessary for conditional execution below,
// since firebase/app code cannot be executed in SSR environments.
const FirebaseLoginAppBarrier = lazy(() => import('lib-firebase/FirebaseLoginAppBarrier'));
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
