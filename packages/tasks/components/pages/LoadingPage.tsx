import React, { ReactElement } from 'react';

import { CircularProgress } from '@material-ui/core';

const LoadingPage = (): ReactElement => (
  <div className="simple-page-center">
    <CircularProgress />
  </div>
);

export default LoadingPage;
