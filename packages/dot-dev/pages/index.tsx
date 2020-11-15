import React, { ReactElement } from 'react';

import FanArtWorkPage from '../components/FanArtWorkPage';
import {
  FAN_ART_ITERATION_0,
  FAN_ART_ITERATION_1,
  FAN_ART_ITERATION_2,
  FAN_ART_ITERATION_3,
  FAN_ART_BIRTHDAY_EDITION,
} from '../components/data';

const ArtsPage = (): ReactElement => (
  <FanArtWorkPage
    title="Fan Arts"
    works={[
      FAN_ART_BIRTHDAY_EDITION,
      FAN_ART_ITERATION_3,
      FAN_ART_ITERATION_2,
      FAN_ART_ITERATION_1,
      FAN_ART_ITERATION_0,
    ]}
  />
);

export default ArtsPage;
