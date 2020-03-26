import React, { ReactElement } from 'react';

import { Route, Switch } from 'react-router-dom';

import HomePage from './HomePage';
import ProjectPage from './ProjectPage';

export default (): ReactElement => (
  <Switch>
    <Route path="/project/:projectId" exact component={ProjectPage} />
    <Route path="/" component={HomePage} />
  </Switch>
);
