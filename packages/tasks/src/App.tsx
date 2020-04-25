import React, { ReactElement } from 'react';

import { Provider as ReactReduxProvider } from 'react-redux';

import HomePage from './components/pages/HomePage';
import { store } from './models/redux-store';

export default (): ReactElement => (
  <ReactReduxProvider store={store}>
    <HomePage />
  </ReactReduxProvider>
);
