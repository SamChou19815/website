import React, { ReactElement } from 'react';

import App from '../components/App';
import PlayAgainstAIGameCard from '../components/PlayAgainstAIGameCard';
import 'infima/dist/css/default/default.css';
import './index.css';
import '../components/game.css';

export default function Index(): ReactElement {
  return (
    <App>
      <PlayAgainstAIGameCard />
    </App>
  );
}
