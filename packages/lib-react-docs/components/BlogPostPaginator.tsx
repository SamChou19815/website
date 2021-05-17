import Link from 'esbuild-scripts/components/Link';
import React from 'react';

import type { BlogPaginationItem } from './blog-types';

export type Props = {
  readonly nextItem?: BlogPaginationItem;
  readonly prevItem?: BlogPaginationItem;
};

export default function BlogPostPaginator({ nextItem, prevItem }: Props): JSX.Element {
  return (
    <nav className="pagination-nav" aria-label="Blog post page navigation">
      <div className="pagination-nav__item">
        {prevItem && (
          <Link className="pagination-nav__link" to={prevItem.permalink}>
            <div className="pagination-nav__sublabel">Newer Post</div>
            <div className="pagination-nav__label">&laquo; {prevItem.title}</div>
          </Link>
        )}
      </div>
      <div className="pagination-nav__item pagination-nav__item--next">
        {nextItem && (
          <Link className="pagination-nav__link" to={nextItem.permalink}>
            <div className="pagination-nav__sublabel">Older Post</div>
            <div className="pagination-nav__label">{nextItem.title} &raquo;</div>
          </Link>
        )}
      </div>
    </nav>
  );
}
