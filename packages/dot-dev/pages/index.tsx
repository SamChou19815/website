import React, { ReactElement } from 'react';

import Head from 'next/head';

import FanArtWorkCard from '../components/FanArtWorkCard';
import { FAN_ART_ITERATION_0, FAN_ART_ITERATION_1, FAN_ART_ITERATION_2 } from '../components/data';

const ArtsPage = (): ReactElement => (
  <div>
    <Head>
      <title>Fan Arts | Random@dev-sam</title>
    </Head>
    <FanArtWorkCard {...FAN_ART_ITERATION_0} />
    <FanArtWorkCard {...FAN_ART_ITERATION_1} />
    <FanArtWorkCard {...FAN_ART_ITERATION_2} />
  </div>
);

export default ArtsPage;
