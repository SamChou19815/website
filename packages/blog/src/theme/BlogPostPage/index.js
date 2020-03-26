/**
 * Copyright (c) 2019-present, Developer Sam.
 *
 * This source code is licensed under the AGPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import BlogPostItem from '@theme/BlogPostItem';
import BlogPostPaginator from '@theme/BlogPostPaginator';
import Layout from '@theme/Layout';

const githubRepositoryUrlPrefix = 'https://github.com/SamChou19815/website';
const githubBlogPostUrlPrefix = `${githubRepositoryUrlPrefix}/blob/master/packages/blog/blog`;

export default ({ content: BlogPostContents }) => {
  const { frontMatter, metadata } = BlogPostContents;
  const markdownFilename = `${metadata.permalink.substring(1).replace(/\//g, '-')}.md`;
  const markdownURL = `${githubBlogPostUrlPrefix}/${markdownFilename}`;
  return (
    <Layout title={metadata.title} description={metadata.description}>
      {BlogPostContents && (
        <div className="container margin-vert--xl">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <div>
                <BlogPostItem frontMatter={frontMatter} metadata={metadata}>
                  <BlogPostContents />
                </BlogPostItem>
                <a href={markdownURL}>Source on GitHub</a>
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
