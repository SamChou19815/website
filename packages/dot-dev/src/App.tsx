import React, { ReactElement } from 'react';

import FanArtWorkCard from './FanArtWorkCard';
import {
  FAN_ART_ITERATION_0,
  FAN_ART_ITERATION_1,
  FAN_ART_ITERATION_2,
  FAN_ART_ITERATION_3,
  FAN_ART_BIRTHDAY_EDITION,
} from './data';

import initializeThemeSwitching from 'lib-react/theme-switcher-initializer';

import 'infima/dist/css/default/default.min.css';
import './index.css';

if (!__SERVER__) {
  initializeThemeSwitching();
}

const ArtsPage = (): ReactElement => (
  <div>
    <nav className="navbar">
      <div className="navbar__inner">
        <div className="navbar__items">
          <a className="navbar__brand" href="/">
            Fan Arts | Random@dev-sam
          </a>
        </div>
        <div className="navbar__items navbar__items--right">
          <a className="navbar__item navbar__link" href="https://developersam.com">
            Home
          </a>
        </div>
      </div>
    </nav>
    <FanArtWorkCard {...FAN_ART_BIRTHDAY_EDITION} />
    <FanArtWorkCard {...FAN_ART_ITERATION_3} />
    <FanArtWorkCard {...FAN_ART_ITERATION_2} />
    <FanArtWorkCard {...FAN_ART_ITERATION_1} />
    <FanArtWorkCard {...FAN_ART_ITERATION_0} />
  </div>
);

export default ArtsPage;
