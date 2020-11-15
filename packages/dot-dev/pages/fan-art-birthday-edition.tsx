import React, { ReactElement } from 'react';

import FanArtWorkPage from '../components/FanArtWorkPage';
import { FAN_ART_BIRTHDAY_EDITION } from '../components/data';

const ArtsPage = (): ReactElement => (
  <FanArtWorkPage title="Fan Art Birthday Edition" works={[FAN_ART_BIRTHDAY_EDITION]} />
);

export default ArtsPage;
