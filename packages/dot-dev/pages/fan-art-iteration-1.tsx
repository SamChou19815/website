import React, { ReactElement } from 'react';

import Head from 'next/head';

import FanArtWorkCard from '../components/FanArtWorkCard';
import { FAN_ART_ITERATION_1 } from '../components/data';

const FanArtItemPage = (): ReactElement => (
  <div>
    <Head>
      <title>Fan Arts Iteration 1 | Random@dev-sam</title>
    </Head>
    <FanArtWorkCard {...FAN_ART_ITERATION_1} />
  </div>
);

export default FanArtItemPage;
