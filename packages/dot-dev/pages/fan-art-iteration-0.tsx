import React, { ReactElement } from 'react';

import FanArtWorkPage from '../components/FanArtWorkPage';
import { FAN_ART_ITERATION_0 } from '../components/data';

const ArtsPage = (): ReactElement => (
  <FanArtWorkPage title="Fan Art Iteration 0" works={[FAN_ART_ITERATION_0]} />
);

export default ArtsPage;
