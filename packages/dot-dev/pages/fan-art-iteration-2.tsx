import React, { ReactElement } from 'react';

import Head from 'next/head';

import FanArtWorkCard from '../components/FanArtWorkCard';
import { FAN_ART_ITERATION_2 } from '../components/data';

const FanArtItemPage = (): ReactElement => (
  <div>
    <Head>
      <title>Fan Arts Iteration 2 | Random@dev-sam</title>
    </Head>
    <FanArtWorkCard {...FAN_ART_ITERATION_2} />
  </div>
);

export default FanArtItemPage;
