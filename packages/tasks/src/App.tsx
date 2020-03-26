import React, { ReactElement } from 'react';

import { Provider as ReactReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import RootRouter from './components/pages/RootRouter';
import { store } from './models/redux-store';

export default (): ReactElement => (
  <BrowserRouter>
    <ReactReduxProvider store={store}>
      <RootRouter />
    </ReactReduxProvider>
  </BrowserRouter>
);
