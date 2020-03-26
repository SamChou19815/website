import React, { ReactElement } from 'react';

import MaterialThemedNavigableAppContainer from '../util/MaterialThemedNavigableAppContainer';

export default (): ReactElement => (
  <MaterialThemedNavigableAppContainer nestedNavigationLevels={[{ title: 'Error' }]}>
    <div className="simple-page-center">You are not authorized to see the content.</div>
  </MaterialThemedNavigableAppContainer>
);
