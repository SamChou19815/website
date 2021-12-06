import CommonHeader from 'esbuild-scripts/components/CommonHeader';
import Link from 'esbuild-scripts/components/Link';
import { useLocation } from 'esbuild-scripts/components/router-hooks';
import React, { ReactNode } from 'react';
import usePageTracking from '../components/react-ga';
import { BLOG_LOGO, BLOG_TITLE, BLOG_URL } from '../constants';
import './index.css';

export default function DocumentWrapper({ children }: { children: ReactNode }): JSX.Element {
  usePageTracking();
  let path = useLocation().pathname;
  if (path.endsWith('/')) path = path.substring(0, path.length - 1);

  return (
    <>
      <CommonHeader
        title="Developer Sam Blog"
        description="Developer Sam's Blog"
        shortcutIcon={BLOG_LOGO}
        ogAuthor="Developer Sam"
        ogURL={`${BLOG_URL}${path}`}
      />
      <nav className="flex sticky top-0 z-40 bg-white filter drop-shadow-sm px-4 py-2 h-16">
        <div className="flex flex-wrap justify-between w-full">
          <div className="flex items-center flex-auto min-w-0">
            <Link className="flex mr-8 items-center text-gray-900 min-w-0" to="/">
              <img className="flex-initial h-8 mr-2" src={BLOG_LOGO} alt="dev-sam logo" />
              <strong className="flex-auto text-lg font-semibold">{BLOG_TITLE}</strong>
            </Link>
          </div>
          <div className="flex items-center min-w-0 flex-initial justify-end">
            <a
              className="px-3 py-1 text-gray-900 font-medium hover:text-blue-500"
              href="https://developersam.com"
            >
              Main Site
            </a>
          </div>
        </div>
      </nav>
      <div className="custom-container my-8 mx-auto">{children}</div>
    </>
  );
}
