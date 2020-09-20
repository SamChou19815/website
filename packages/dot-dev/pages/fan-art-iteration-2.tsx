import React, { ReactElement } from 'react';

import FanArtWorkPage from '../components/FanArtWorkPage';
import { FAN_ART_ITERATION_2 } from '../components/data';

const ArtsPage = (): ReactElement => (
  <FanArtWorkPage title="Fan Art Iteration 2" works={[FAN_ART_ITERATION_2]} />
);

export default ArtsPage;