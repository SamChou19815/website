import React, { ReactElement } from 'react';

import Head from 'next/head';

import FanArtWorkCard from '../components/FanArtWorkCard';
import { FAN_ART_ITERATION_0 } from '../components/data';

const FanArtItemPage = (): ReactElement => (
  <div>
    <Head>
      <title>Fan Arts Iteration 0 | Random@dev-sam</title>
    </Head>
    <FanArtWorkCard {...FAN_ART_ITERATION_0} />
  </div>
);

export default FanArtItemPage;
