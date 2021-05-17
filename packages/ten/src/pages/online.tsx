import FirebaseLoginAppBarrier from 'lib-firebase/FirebaseLoginAppBarrier';
import React, { lazy, Suspense } from 'react';

const OnlineGameWrapper = lazy(() => import('../components/OnlineGameWrapper'));

export default function OnlineGamePage(): JSX.Element {
  return (
    <FirebaseLoginAppBarrier>
      <Suspense fallback={null}>
        <OnlineGameWrapper />
      </Suspense>
    </FirebaseLoginAppBarrier>
  );
}
