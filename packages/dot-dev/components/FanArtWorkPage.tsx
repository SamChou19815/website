import React, { ReactElement } from 'react';

import Head from 'next/head';

import FanArtWorkCard from '../components/FanArtWorkCard';
import type { FanArtWork } from '../components/data';

type Props = {
  readonly title: string;
  readonly works: readonly FanArtWork[];
};

const ArtsPage = ({ title, works }: Props): ReactElement => (
  <div>
    <Head>
      <title>{title} | Random@dev-sam</title>
    </Head>
    {works.map((work) => (
      <FanArtWorkCard key={work.pageLink} {...work} />
    ))}
  </div>
);

export default ArtsPage;
