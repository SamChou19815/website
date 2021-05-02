// Forked from
// https://github.com/facebook/docusaurus/blob/master/packages/docusaurus-theme-classic/src/theme/DocPaginator/index.tsx

import React from 'react';

import Link from 'esbuild-scripts/components/Link';

type Item = { readonly title: string; readonly permalink: string };

type Props = { readonly previous?: Item; readonly next?: Item };

const DocPaginator = ({ previous, next }: Props): JSX.Element => {
  return (
    <nav className="pagination-nav" aria-label="Docs pages navigation">
      <div className="pagination-nav__item">
        {previous && (
          <Link className="pagination-nav__link" to={previous.permalink}>
            <div className="pagination-nav__sublabel">Previous</div>
            <div className="pagination-nav__label">&laquo; {previous.title}</div>
          </Link>
        )}
      </div>
      <div className="pagination-nav__item pagination-nav__item--next">
        {next && (
          <Link className="pagination-nav__link" to={next.permalink}>
            <div className="pagination-nav__sublabel">Next</div>
            <div className="pagination-nav__label">{next.title} &raquo;</div>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default DocPaginator;
