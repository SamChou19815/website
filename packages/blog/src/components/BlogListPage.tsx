import Layout from '@theme/Layout';
import React from 'react';

import BlogPostItem from './BlogPostItem';
import type { Content } from './types';

type Props = { readonly items: readonly { readonly content: Content }[] };

export default function BlogListPage({ items }: Props): JSX.Element {
  return (
    <Layout title="Blog" description="Developer Sam Blog">
      <div className="container margin-vert--lg">
        <div className="row">
          <main className="col col--10">
            {items.map(({ content: BlogPostContent }) => (
              <BlogPostItem
                key={BlogPostContent.metadata.permalink}
                frontMatter={BlogPostContent.frontMatter}
                metadata={BlogPostContent.metadata}
                truncated={BlogPostContent.metadata.truncated}
              >
                <BlogPostContent />
              </BlogPostItem>
            ))}
          </main>
        </div>
      </div>
    </Layout>
  );
}
