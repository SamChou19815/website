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
              </div>
              <article className="margin-bottom--xl">
                <h2>Copyright Notices</h2>
                <div>
                  You are allowed to redistribute the blog post under{' '}
                  <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>.
                </div>
              </article>
              {(metadata.nextItem || metadata.prevItem) && (
                <div className="margin-vert--xl">
                  <BlogPostPaginator
                    githubSourceLink={markdownURL}
                    nextItem={metadata.nextItem}
                    prevItem={metadata.prevItem}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};
