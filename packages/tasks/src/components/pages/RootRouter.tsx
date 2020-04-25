import React, { ReactElement } from 'react';

import { Route, Switch } from 'react-router-dom';

import HomePage from './HomePage';

export default (): ReactElement => (
  <Switch>
    <Route path="/" component={HomePage} />
  </Switch>
);
