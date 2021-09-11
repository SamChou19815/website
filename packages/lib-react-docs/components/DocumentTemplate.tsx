import clsx from 'clsx';
import CommonHeader from 'esbuild-scripts/components/CommonHeader';
import Link from 'esbuild-scripts/components/Link';
import React, { FC, ReactNode } from 'react';

import useActivePath from './useActivePath';

const NavLink = ({ name, to, active }: Readonly<{ name: string; to: string; active: boolean }>) => (
  <Link className={clsx('navbar__item', 'navbar__link', active && 'navbar__link--active')} to={to}>
    {name}
  </Link>
);

type Props = {
  readonly title: string;
  readonly description: string;
  readonly logo: string;
  readonly author?: string;
  readonly url: string;
  readonly firstDocumentLink?: string;
  readonly otherLinks: readonly { readonly name: string; readonly link: string }[];
  readonly copyright?: string;
};

function DocumentTemplate({
  title,
  description,
  logo,
  author,
  url,
  firstDocumentLink,
  otherLinks,
  copyright,
  children,
}: Props & { readonly children: ReactNode }): JSX.Element {
  const path = useActivePath();
  return (
    <>
      <CommonHeader
        title={title}
        description={description}
        shortcutIcon={logo}
        ogAuthor={author}
        ogURL={url + path}
      />
      <nav className="navbar navbar--fixed-top">
        <div className="navbar__inner">
          <div className="navbar__items">
            <Link className="navbar__brand" to="/">
              <img className="navbar__logo" src={logo} alt="Logo" />
              <strong className="navbar__title">{title}</strong>
            </Link>
            {firstDocumentLink && (
              <NavLink name="Docs" to={firstDocumentLink} active={path.startsWith('/docs')} />
            )}
            {otherLinks
              .filter((it) => !it.link.startsWith('http'))
              .map(({ name, link }) => (
                <NavLink key={link} name={name} to={link} active={path === link} />
              ))}
          </div>
          <div className="navbar__items navbar__items--right">
            {otherLinks
              .filter((it) => it.link.startsWith('http'))
              .map(({ name, link }) => (
                <a
                  key={link}
                  className="navbar__item navbar__link"
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                >
                  {name}
                </a>
              ))}
          </div>
        </div>
      </nav>
      <div className="main-wrapper">{children}</div>
      {copyright && (
        <footer className="footer footer--dark">
          <div className="container">
            <div className="footer__bottom text--center">
              <div className="footer__copyright">{copyright}</div>
            </div>
          </div>
        </footer>
      )}
    </>
  );
}

const createDocumentComponent = (props: Props): FC =>
  function Document({ children }): JSX.Element {
    return <DocumentTemplate {...props}>{children}</DocumentTemplate>;
  };

export default createDocumentComponent;
