import React, { ReactElement } from 'react';

import App from '../components/App';
import StatefulGameCard from '../components/StatefulGameCard';

import './index.css';

export default function Index(): ReactElement {
  return (
    <App>
      <StatefulGameCard />
    </App>
  );
}
