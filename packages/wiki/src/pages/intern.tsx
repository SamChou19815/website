/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */

import React, { ReactElement, Suspense, lazy } from 'react';

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import Layout from '@theme/Layout';

// Lazy import is necessary for conditional execution below,
// since firebase/app code cannot be executed in SSR environments.
const FirebaseLoginAppBarrier = lazy(() => import('../app/FirebaseLoginAppBarrier'));

export default function InternTierAccessEntryPoint(): ReactElement {
  return (
    <Layout title="@dev-sam internals" description="Restricted-access internal portal">
      {ExecutionEnvironment.canUseDOM
        ? (
          <Suspense fallback={null}>
            <FirebaseLoginAppBarrier isDataLoaded={true} dataLoader={() => { }} />
          </Suspense>
        )
        : <div />}
    </Layout>
  );
}
