import React, { ReactElement } from 'react';

import './LoadingOverlay.css';

const LoadingOverlay = (): ReactElement => (
  <div className="loading-overlay">
    <div className="loading-ring">
      <div />
      <div />
      <div />
      <div />
    </div>
  </div>
);

export default LoadingOverlay;
