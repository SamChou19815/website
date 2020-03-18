import React, { ReactElement } from 'react';

import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router';

export default (): ReactElement => {
  const history = useHistory();
  return (
    <Button color="inherit" onClick={() => history.push('/')}>
      Home
    </Button>
  );
};
