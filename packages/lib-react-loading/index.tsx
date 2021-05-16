import React from 'react';

import './styles.css';

const LoadingOverlay = (): JSX.Element => (
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
