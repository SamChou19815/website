import React, { ReactElement, ReactNode, Suspense } from 'react';

type Props = { readonly fallback: ReactElement | null; readonly children: ReactNode };

declare const __SERVER__: boolean;

const SSRSuspense = ({ fallback, children }: Props): ReactElement | null =>
  __SERVER__ ? fallback : <Suspense fallback={fallback}>{children}</Suspense>;

export default SSRSuspense;
