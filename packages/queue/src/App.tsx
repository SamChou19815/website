import React, { ReactElement } from 'react';

import 'lib-firebase';

import ConfiguredMainAppBarrier from './components/ConfiguredMainAppBarrier';
import MainApp from './components/MainApp';
import MaterialThemedApp from './components/MaterialThemedApp';

const Wrapped = (): ReactElement => (
  <MaterialThemedApp title="Queue">
    <MainApp />
  </MaterialThemedApp>
);

export default (): ReactElement => <ConfiguredMainAppBarrier appComponent={Wrapped} />;
