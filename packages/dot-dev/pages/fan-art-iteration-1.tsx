import React, { ReactElement } from 'react';

import FanArtWorkPage from '../components/FanArtWorkPage';
import { FAN_ART_ITERATION_1 } from '../components/data';

const ArtsPage = (): ReactElement => (
  <FanArtWorkPage title="Fan Art Iteration 1" works={[FAN_ART_ITERATION_1]} />
);

export default ArtsPage;
