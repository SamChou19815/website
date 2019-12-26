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

export default ({ content: BlogPostContents }) => {
  const { frontMatter, metadata } = BlogPostContents;
  return (
    <Layout title={metadata.title} description={metadata.description}>
      {BlogPostContents && (
        <div className={styles.Container}>
          <div className="row">
            <div className="col col--6 col--offset-3">
              <div className={styles.BlogPostItem}>
                <BlogPostItem frontMatter={frontMatter} metadata={metadata}>
                  <BlogPostContents />
                </BlogPostItem>
              </div>
              {(metadata.nextItem || metadata.prevItem) && (
                <div className="margin-vert--xl">
                  <BlogPostPaginator nextItem={metadata.nextItem} prevItem={metadata.prevItem} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};
