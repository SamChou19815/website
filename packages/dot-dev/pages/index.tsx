import React, { ReactElement } from 'react';

import FanArtWorkPage from '../components/FanArtWorkPage';
import { FAN_ART_ITERATION_0, FAN_ART_ITERATION_1, FAN_ART_ITERATION_2 } from '../components/data';

const ArtsPage = (): ReactElement => (
  <FanArtWorkPage
    title="Fan Arts"
    works={[FAN_ART_ITERATION_0, FAN_ART_ITERATION_1, FAN_ART_ITERATION_2]}
  />
);

export default ArtsPage;
