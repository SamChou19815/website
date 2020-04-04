import React, { ReactElement } from 'react';

import 'lib-firebase';

import { Provider as ReactReduxProvider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import HomePage from './components/HomePage';
import QueuePage from './components/QueuePage';
import { store } from './models/redux-store';

export default (): ReactElement => (
  <BrowserRouter>
    <ReactReduxProvider store={store}>
      <Switch>
        <Route path="/queue/:queueId" exact component={QueuePage} />
        <Route path="/" component={HomePage} />
      </Switch>
    </ReactReduxProvider>
  </BrowserRouter>
);
