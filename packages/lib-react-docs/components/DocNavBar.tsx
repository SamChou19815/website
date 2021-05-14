import clsx from 'clsx';
import React from 'react';

import Link from 'esbuild-scripts/components/Link';
import { useLocation } from 'esbuild-scripts/components/router-hooks';

const NavLink = ({ name, to, active }: Readonly<{ name: string; to: string; active: boolean }>) => (
  <Link className={clsx('navbar__item', 'navbar__link', active && 'navbar__link--active')} to={to}>
    {name}
  </Link>
);

type Props = {
  readonly title: string;
  readonly logo: string;
  readonly logoName: string;
  readonly firstDocumentLink?: string;
  readonly otherLinks: readonly { readonly name: string; readonly link: string }[];
};

const DocNavBar = ({
  title,
  logo,
  logoName,
  firstDocumentLink,
  otherLinks,
}: Props): JSX.Element => {
  const path = useLocation().pathname;
  return (
    <nav className="navbar navbar--fixed-top">
      <div className="navbar__inner">
        <div className="navbar__items">
          <Link className="navbar__brand" to="/">
            <img className="navbar__logo" src={logo} alt={logoName} />
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
  );
};

export default DocNavBar;