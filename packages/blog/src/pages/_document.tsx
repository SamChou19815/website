import React, { ReactElement, ReactNode } from 'react';

import CommonHeader from 'esbuild-scripts/components/CommonHeader';
import Link from 'esbuild-scripts/components/Link';

import 'infima/dist/css/default/default.min.css';
import './index.css';

const Document = ({ children }: { readonly children: ReactNode }): ReactElement => {
  return (
    <>
      <CommonHeader
        title="Developer Sam's Blog"
        description="Developer Sam's Blog"
        shortcutIcon="https://developersam.com/favicon.ico"
        htmlLang="en"
        ogAuthor="Developer Sam"
        ogURL="https://blog.developersam.com/"
      />
      <nav className="navbar navbar--fixed-top">
        <div className="navbar__inner">
          <div className="navbar__items">
            <Link className="navbar__brand" to="/">
              <img
                className="navbar__logo"
                src="https://developersam.com/logo.png"
                alt="Developer Sam Logo"
              />
              <strong className="navbar__title">Developer Sam Blog</strong>
            </Link>
          </div>
          <div className="navbar__items navbar__items--right">
            <a
              className="navbar__item navbar__link"
              href="https://developersam.com"
              target="_blank"
              rel="noreferrer"
            >
              Main Site
            </a>
            <a
              className="navbar__item navbar__link"
              href="https://github.com/SamChou19815/website"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </nav>
      <div className="main-wrapper">{children}</div>
      <footer className="footer footer--dark">
        <div className="container">
          <div className="footer__bottom text--center">
            <div className="footer__copyright">Copyright © 2016-2021 Developer Sam.</div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Document;
