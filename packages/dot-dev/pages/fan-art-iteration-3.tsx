import type { ReactElement } from 'react';

import FanArtWorkPage from '../components/FanArtWorkPage';
import { FAN_ART_ITERATION_3 } from '../components/data';

const ArtsPage = (): ReactElement => (
  <FanArtWorkPage title="Fan Art Iteration 3" works={[FAN_ART_ITERATION_3]} />
);

export default ArtsPage;
