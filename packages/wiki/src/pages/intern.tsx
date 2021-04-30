import React, { ReactElement, lazy } from 'react';

import Head from 'esbuild-scripts/components/Head';
import SSRSuspense from 'esbuild-scripts/components/SSRSuspense';
import LoadingOverlay from 'lib-react-loading';

// Lazy import is necessary for conditional execution below,
// since firebase/app code cannot be executed in SSR environments.
const FirebaseLoginAppBarrier = lazy(() => import('lib-firebase/FirebaseLoginAppBarrier'));
const App = lazy(() => import('../app/App'));

export default function InternTierAccessEntryPoint(): ReactElement {
  return (
    <>
      <Head>
        <title>internals@dev-sam | Wiki</title>
        <meta name="description" content="Restricted-access internal portal" />
        <meta property="og:description" content="Restricted-access internal portal" />
      </Head>
      <SSRSuspense fallback={<LoadingOverlay />}>
        <FirebaseLoginAppBarrier>
          <App />
        </FirebaseLoginAppBarrier>
      </SSRSuspense>
    </>
  );
}
