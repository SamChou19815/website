import { ReactNode, Suspense } from 'react';

type SuspenseType = (props: {
  readonly fallback: JSX.Element | null;
  readonly children: ReactNode;
}) => JSX.Element | null;

declare const __SERVER__: boolean;

const SSRSuspense: SuspenseType = __SERVER__ ? ({ fallback }) => fallback : Suspense;
export default SSRSuspense;
