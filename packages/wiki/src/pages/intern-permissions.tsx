import React, { ReactElement, Suspense, lazy } from 'react';

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import Layout from '@theme/Layout';

import LoadingOverlay from 'lib-react/LoadingOverlay';

// Lazy import is necessary for conditional execution below,
// since firebase/app code cannot be executed in SSR environments.
const FirebaseLoginAppBarrier = lazy(() => import('lib-firebase/FirebaseLoginAppBarrier'));
const PermissionViewer = lazy(() => import('../app/PermissionViewer'));

export default function InternPermissions(): ReactElement {
  return (
    <Layout title="internals-permissions@dev-sam" description="Show a list of permissions">
      {ExecutionEnvironment.canUseDOM ? (
        <Suspense fallback={<LoadingOverlay />}>
          <FirebaseLoginAppBarrier>
            <PermissionViewer />
          </FirebaseLoginAppBarrier>
        </Suspense>
      ) : (
        <div />
      )}
    </Layout>
  );
}
