import React, { ReactElement } from 'react';

import App from '../components/App';
import LocalGameCards from '../components/LocalGameCards';

import './index.css';

export default function Local(): ReactElement {
  return (
    <App>
      <LocalGameCards />
    </App>
  );
}
