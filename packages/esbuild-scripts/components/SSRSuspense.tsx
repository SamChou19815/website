import { type ReactNode, Suspense } from "react";

type SuspenseType = (props: {
  readonly fallback: JSX.Element | null;
  readonly children: ReactNode;
}) => ReactNode;

declare const __SERVER__: boolean;

const SSRSuspense: SuspenseType = __SERVER__ ? ({ fallback }) => fallback : Suspense;
export default SSRSuspense;
