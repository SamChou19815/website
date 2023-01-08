import CommonHeader from 'esbuild-scripts/components/CommonHeader';
import Link from 'esbuild-scripts/components/Link';
import { useLocation } from 'esbuild-scripts/components/router-hooks';
import type { ReactNode } from 'react';
import { BLOG_LOGO, BLOG_TITLE, BLOG_URL } from '../constants';
import 'lib-react-prism/common.css';

export default function DocumentWrapper({ children }: { children: ReactNode }): JSX.Element {
  let path = useLocation().pathname;
  if (path.endsWith('/')) {
    path = path.substring(0, path.length - 1);
  }

  return (
    <>
      <CommonHeader
        title="Developer Sam Blog"
        description="Developer Sam's Blog"
        shortcutIcon={BLOG_LOGO}
        ogAuthor="Developer Sam"
        ogURL={`${BLOG_URL}${path}`}
        gaId="G-K50MLQ68K6"
      />
      <nav className="sticky top-0 z-40 flex h-16 bg-white px-4 py-2 drop-shadow-sm filter">
        <div className="flex w-full flex-wrap justify-between">
          <div className="flex min-w-0 flex-auto items-center">
            <Link className="mr-8 flex min-w-0 items-center text-gray-900" to="/">
              <img className="mr-2 h-8 flex-initial" src={BLOG_LOGO} alt="dev-sam logo" />
              <strong className="flex-auto text-lg font-semibold">{BLOG_TITLE}</strong>
            </Link>
          </div>
          <div className="flex min-w-0 flex-initial items-center justify-end">
            <a
              className="px-3 py-1 font-medium text-gray-900 hover:text-blue-500"
              href="https://developersam.com"
            >
              Main Site
            </a>
          </div>
        </div>
      </nav>
      <div className="lg:max-w-screen-lg my-8 mx-auto">{children}</div>
    </>
  );
}
