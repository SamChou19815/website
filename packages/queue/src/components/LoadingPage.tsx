import React, { ReactElement } from 'react';

import { CircularProgress } from '@material-ui/core';

export default (): ReactElement => (
  <div className="simple-page-center">
    <CircularProgress />
  </div>
);
