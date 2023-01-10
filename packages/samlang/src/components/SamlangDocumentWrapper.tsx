import CommonHeader from 'esbuild-scripts/components/CommonHeader';
import { useLocation } from 'esbuild-scripts/components/router-hooks';
import type { ReactNode } from 'react';

export default function SamlangDocumentWrapper({
  children,
}: {
  readonly children: ReactNode;
}): JSX.Element {
  let path = useLocation().pathname;
  if (path.endsWith('/')) {
    path = path.substring(0, path.length - 1);
  }

  return (
    <>
      <CommonHeader
        title="samlang"
        description="Sam's Programming Language"
        shortcutIcon="/img/favicon.png"
        ogURL={`https://samlang.io${path}`}
        gaId="G-K50MLQ68K6"
      />
      {children}
    </>
  );
}
