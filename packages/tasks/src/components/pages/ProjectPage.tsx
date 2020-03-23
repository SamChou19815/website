import React, { ReactElement } from 'react';

import { createProjectId } from '../../models/ids';
import ProjectPageLayout from '../includes/ProjectPageLayout';
import { RouteComponentsWithProjectIdParameter } from './router-types';

export default ({
  match: {
    params: { projectId: projectIdString },
  },
}: RouteComponentsWithProjectIdParameter): ReactElement => (
  <ProjectPageLayout projectId={createProjectId(projectIdString)} />
);
