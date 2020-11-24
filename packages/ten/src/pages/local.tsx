import React, { ReactElement } from 'react';

import App from '../components/App';
import LocalGameCard from '../components/LocalGameCard';

import './index.css';

export default function Local(): ReactElement {
  return (
    <App>
      <LocalGameCard />
    </App>
  );
}
