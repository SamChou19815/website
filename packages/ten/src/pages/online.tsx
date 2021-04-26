import React, { lazy, ReactElement, Suspense } from 'react';

import FirebaseLoginAppBarrier from 'lib-firebase/FirebaseLoginAppBarrier';

const OnlineGameWrapper = lazy(() => import('../components/OnlineGameWrapper'));

export default function OnlineGamePage(): ReactElement {
  return (
    <FirebaseLoginAppBarrier>
      <Suspense fallback={null}>
        <OnlineGameWrapper />
      </Suspense>
    </FirebaseLoginAppBarrier>
  );
}
