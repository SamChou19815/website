/**
 * Copyright (c) 2019-present, Developer Sam.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Layout from '@theme/Layout';
import BlogPostItem from '@theme/BlogPostItem';
import BlogPostPaginator from '@theme/BlogPostPaginator';

import styles from '../common.module.css';

export default ({ content: BlogPostContents, metadata, nextItem, prevItem }) => (
  <Layout title={metadata.title} description={metadata.description}>
    {BlogPostContents && (
      <div className={styles.Container}>
        <div className="row">
          <div className="col col--6 col--offset-3">
            <div className={styles.BlogPostItem}>
              <BlogPostItem frontMatter={BlogPostContents.frontMatter} metadata={metadata}>
                <BlogPostContents />
              </BlogPostItem>
            </div>
            <div className="margin-vert--xl">
              <BlogPostPaginator nextItem={nextItem} prevItem={prevItem} />
            </div>
          </div>
        </div>
      </div>
    )}
  </Layout>
);
