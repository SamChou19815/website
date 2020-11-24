import React, { ReactElement } from 'react';

import App from '../components/App';
import GameCardWithLogic from '../components/GameCardWithLogic';

import './index.css';

export default function Local(): ReactElement {
  return (
    <App>
      <GameCardWithLogic showGameStarterButtons={false} />
    </App>
  );
}
