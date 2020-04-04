import React, { ReactElement } from 'react';

import 'lib-firebase';

import { Provider as ReactReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import ConfiguredMainAppBarrier from './components/ConfiguredMainAppBarrier';
import MainApp from './components/MainApp';
import MaterialThemedApp from './components/MaterialThemedApp';
import { store } from './models/redux-store';

const Wrapped = (): ReactElement => (
  <MaterialThemedApp title="Queue">
    <MainApp />
  </MaterialThemedApp>
);

export default (): ReactElement => (
  <BrowserRouter>
    <ReactReduxProvider store={store}>
      <ConfiguredMainAppBarrier appComponent={Wrapped} />
    </ReactReduxProvider>
  </BrowserRouter>
);
