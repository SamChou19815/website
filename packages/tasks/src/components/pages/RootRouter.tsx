import React, { ReactElement } from 'react';

import { Route, Switch } from 'react-router-dom';

import HomePage from './HomePage';
import ProjectDashboardPage from './ProjectDashboardPage';
import ProjectGraphPage from './ProjectGraphPage';

export default (): ReactElement => (
  <Switch>
    <Route path="/project/:projectId/graph" exact component={ProjectGraphPage} />
    <Route path="/project/:projectId" exact component={ProjectDashboardPage} />
    <Route path="/" exact component={HomePage} />
  </Switch>
);
