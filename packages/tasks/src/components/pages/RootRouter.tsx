import React, { ReactElement } from 'react';

import { BrowserRouter, Route, Switch } from 'react-router-dom';

import HomePage from './HomePage';
import ProjectDashboardPage from './ProjectDashboardPage';
import ProjectGraphPage from './ProjectGraphPage';

export default (): ReactElement => (
  <BrowserRouter>
    <Switch>
      <Route path="/project/:projectId/dashboard" exact component={ProjectDashboardPage} />
      <Route path="/project/:projectId/graph" exact component={ProjectGraphPage} />
      <Route path="/project/:projectId" exact component={ProjectDashboardPage} />
      <Route path="/" exact component={HomePage} />
    </Switch>
  </BrowserRouter>
);
