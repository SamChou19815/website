import clsx from 'clsx';
import CommonHeader from 'esbuild-scripts/components/CommonHeader';
import Link from 'esbuild-scripts/components/Link';
import useActivePath from 'lib-react-docs/useActivePath';
import React, { ReactNode } from 'react';

import { SAMLANG_TITLE, SAMLANG_LOGO, SAMLANG_URL } from '../constants';

import 'infima/dist/css/default/default.min.css';
import './docs-styles.css';
import './custom.css';

const NavLink = ({ name, to, active }: Readonly<{ name: string; to: string; active: boolean }>) => (
  <Link className={clsx('navbar__item', 'navbar__link', active && 'navbar__link--active')} to={to}>
    {name}
  </Link>
);

export default function DocumentTemplate({
  children,
}: {
  readonly children: ReactNode;
}): JSX.Element {
  const path = useActivePath();
  return (
    <>
      <CommonHeader
        title={SAMLANG_TITLE}
        description="Sam's Programming Language"
        shortcutIcon={SAMLANG_LOGO}
        ogURL={`${SAMLANG_URL}${path}`}
      />
      <nav className="navbar navbar--fixed-top">
        <div className="navbar__inner">
          <div className="navbar__items">
            <Link className="navbar__brand" to="/">
              <img className="navbar__logo" src={SAMLANG_LOGO} alt="Logo" />
              <strong className="navbar__title">{SAMLANG_TITLE}</strong>
            </Link>
            <NavLink name="Docs" to="/docs/introduction" active={path.startsWith('/docs')} />
            <NavLink name="Demo" to="/demo" active={path === '/demo'} />
          </div>
          <div className="navbar__items navbar__items--right">
            <a
              className="navbar__item navbar__link"
              href="https://github.com/SamChou19815/samlang"
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
            <div className="footer__copyright">Copyright © 2019-2021 Developer Sam.</div>
          </div>
        </div>
      </footer>
    </>
  );
}
