/**
 * Copyright (c) 2019-present, Developer Sam.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import BlogListPaginator from '@theme/BlogListPaginator';
import BlogPostItem from '@theme/BlogPostItem';
import Layout from '@theme/Layout';

import styles from '../common.module.css';

export default ({ metadata, items }) => (
  <Layout title="Developer Sam Blog" description="Developer Sam Blog">
    <div className={styles.Container}>
      <div className="row">
        <div className="col col--6 col--offset-3">
          {items.map(({ content: BlogPostContent }) => (
            <div className={styles.BlogPostItem} key={BlogPostContent.metadata.permalink}>
              <BlogPostItem
                frontMatter={BlogPostContent.frontMatter}
                metadata={BlogPostContent.metadata}
                truncated
              >
                <BlogPostContent />
              </BlogPostItem>
            </div>
          ))}
          <BlogListPaginator metadata={metadata} />
        </div>
      </div>
    </div>
  </Layout>
);
