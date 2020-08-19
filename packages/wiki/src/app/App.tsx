import React, { ReactElement } from 'react';

import { getAppUser } from './authentication';

const App = (): ReactElement => (
  <div className="simple-page-center">
    Hello {getAppUser().displayName}!
  </div>
);

export default App;
