import React from 'react';

import Head from 'esbuild-scripts/components/Head';

type Props = { readonly title: string };

const HeadTitle = ({ title }: Props): JSX.Element => (
  <Head>
    <title>{title}</title>
    <meta property="og:title" content={title} />
  </Head>
);

export default HeadTitle;
