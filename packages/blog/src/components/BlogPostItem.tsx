import Link from 'esbuild-scripts/components/Link';
import MDXProvider from 'esbuild-scripts/components/MDXProvider';
import React from 'react';

import Article from './Article';
import MDXComponents from './MDXComponents';
import type { Metadata } from './blog-types';

type Props = {
  readonly metadata: Metadata;
  readonly truncated?: boolean;
  readonly children?: JSX.Element;
};

export default function BlogPostItem(props: Props): JSX.Element {
  const { children, metadata, truncated } = props;
  const { title, date, formattedDate, permalink } = metadata;

  const TitleHeading = truncated ? 'h2' : 'h1';

  return (
    <Article>
      <header>
        <TitleHeading className="font-sans mb-2">
          {truncated ? <Link to={permalink}>{title}</Link> : title}
        </TitleHeading>
        <div className="my-4">
          <time dateTime={date} className="text-sm">
            {formattedDate}
          </time>
        </div>
      </header>
      {children && (
        <div className="markdown">
          <MDXProvider components={MDXComponents}>{children}</MDXProvider>
        </div>
      )}
    </Article>
  );
}
