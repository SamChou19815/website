import CommonHeader from 'esbuild-scripts/components/CommonHeader';
import Link from 'esbuild-scripts/components/Link';
import { useLocation } from 'esbuild-scripts/components/router-hooks';
import React, { ReactNode } from 'react';
import './index.css';

export default function Document({ children }: { readonly children: ReactNode }): JSX.Element {
  const path = useLocation().pathname;

  const activeNavClass = (expectedPath: string) =>
    path === expectedPath
      ? 'px-3 py-1 text-gray-900 font-medium text-blue-500'
      : 'px-3 py-1 text-gray-900 font-medium hover:text-blue-500';

  return (
    <>
      <CommonHeader
        title="TEN Game"
        description="TEN Game"
        shortcutIcon="/favicon.ico"
        htmlLang="en"
      />
      <nav className="flex bg-white filter drop-shadow-sm px-4 py-2 h-16">
        <div className="flex flex-wrap justify-between w-full">
          <div className="flex items-center flex-auto min-w-0">
            <a className="flex mr-8 items-center text-gray-900 min-w-0" href="/">
              <img className="flex-initial h-8 mr-2" src="/logo.png" alt="TEN App logo" />
              <h1 className="flex-auto text-lg font-bold">TEN</h1>
            </a>
          </div>
          <div className="flex items-center min-w-0 flex-initial justify-end">
            <Link className={activeNavClass('/')} to="/">
              Against AI
            </Link>
            <Link className={activeNavClass('/local')} to="/local">
              Against Friend
            </Link>
          </div>
        </div>
      </nav>
      {children}
    </>
  );
}
