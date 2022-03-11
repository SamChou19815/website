import CommonHeader from 'esbuild-scripts/components/CommonHeader';
import Link from 'esbuild-scripts/components/Link';
import { useLocation } from 'esbuild-scripts/components/router-hooks';
import React, { ReactNode } from 'react';

export default function TenGameDocumentWrapper({
  children,
}: {
  readonly children: ReactNode;
}): JSX.Element {
  const path = useLocation().pathname;

  const activeNavClass = (expectedPath: string) =>
    path === expectedPath || path === `${expectedPath}/`
      ? 'px-3 py-1 font-medium text-blue-500'
      : 'px-3 py-1 text-gray-900 font-medium hover:text-blue-500';

  return (
    <>
      <CommonHeader
        title="TEN Game"
        description="TEN Game"
        shortcutIcon="/favicon.ico"
        htmlLang="en"
      />
      <nav className="flex h-16 bg-white px-4 py-2 drop-shadow-sm filter">
        <div className="flex w-full flex-wrap justify-between">
          <div className="flex min-w-0 flex-auto items-center">
            <a className="mr-8 flex min-w-0 items-center text-gray-900" href="/">
              <img className="mr-2 h-8 flex-initial" src="/logo.png" alt="TEN App logo" />
              <h1 className="flex-auto text-lg font-bold">TEN</h1>
            </a>
          </div>
          <div className="flex min-w-0 flex-initial items-center justify-end">
            <Link className={activeNavClass('/ten')} to="/ten">
              Against AI
            </Link>
            <Link className={activeNavClass('/ten/local')} to="/ten/local">
              Against Friend
            </Link>
          </div>
        </div>
      </nav>
      {children}
    </>
  );
}
