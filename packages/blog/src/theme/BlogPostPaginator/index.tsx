/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Link from '@docusaurus/Link';

function BlogPostPaginator(props) {
  const { nextItem, prevItem, githubSourceLink } = props;

  return (
    <nav className="pagination-nav">
      <div className="pagination-nav__item">
        {githubSourceLink && (
          <Link className="pagination-nav__link" to={githubSourceLink}>
            <h5 className="pagination-nav__sublabel">Source Code</h5>
            <h4 className="pagination-nav__label">Read on GitHub</h4>
          </Link>
        )}
      </div>
      <div className="pagination-nav__item">
        {prevItem && (
          <Link className="pagination-nav__link" to={prevItem.permalink}>
            <h5 className="pagination-nav__sublabel">Previous Post</h5>
            <h4 className="pagination-nav__label">&laquo; {prevItem.title}</h4>
          </Link>
        )}
      </div>
      <div className="pagination-nav__item pagination-nav__item--next">
        {nextItem && (
          <Link className="pagination-nav__link" to={nextItem.permalink}>
            <h5 className="pagination-nav__sublabel">Next Post</h5>
            <h4 className="pagination-nav__label">{nextItem.title} &raquo;</h4>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default BlogPostPaginator;
