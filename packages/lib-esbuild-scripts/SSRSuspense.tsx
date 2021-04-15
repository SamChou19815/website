import { ReactElement, ReactNode, Suspense } from 'react';

type SuspenseType = (props: {
  readonly fallback: ReactElement | null;
  readonly children: ReactNode;
}) => ReactElement | null;

declare const __SERVER__: boolean;

const SSRSuspense: SuspenseType = __SERVER__ ? ({ fallback }) => fallback : Suspense;
export default SSRSuspense;
