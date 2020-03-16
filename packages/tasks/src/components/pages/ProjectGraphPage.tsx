import React, { ReactElement } from 'react';
import { RouteComponentsWithProjectIdParameter } from './router-types';

export default ({
  match: {
    params: { projectId }
  }
}: RouteComponentsWithProjectIdParameter): ReactElement => (
  <div>Project {projectId} Graph Page</div>
);
