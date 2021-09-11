// Forked from
// https://github.com/facebook/docusaurus/blob/master/packages/docusaurus-theme-classic/src/theme/DocPaginator/index.tsx

import Link from 'esbuild-scripts/components/Link';
import React from 'react';

type Item = { readonly label: string; readonly href: string };

type Props = { readonly previous?: Item; readonly next?: Item };

export default function DocPaginator({ previous, next }: Props): JSX.Element {
  return (
    <nav className="pagination-nav" aria-label="Docs pages navigation">
      <div className="pagination-nav__item">
        {previous && (
          <Link className="pagination-nav__link" to={previous.href}>
            <div className="pagination-nav__sublabel">Previous</div>
            <div className="pagination-nav__label">&laquo; {previous.label}</div>
          </Link>
        )}
      </div>
      <div className="pagination-nav__item pagination-nav__item--next">
        {next && (
          <Link className="pagination-nav__link" to={next.href}>
            <div className="pagination-nav__sublabel">Next</div>
            <div className="pagination-nav__label">{next.label} &raquo;</div>
          </Link>
        )}
      </div>
    </nav>
  );
}
