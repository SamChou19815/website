import React, { ReactElement } from 'react';

import { createProjectId } from '../../models/ids';
import ProjectPageLayout from '../includes/ProjectPageLayout';
import TaskGraphCanvas from '../includes/TaskGraphCanvas';
import { RouteComponentsWithProjectIdParameter } from './router-types';

export default ({
  match: {
    params: { projectId },
  },
}: RouteComponentsWithProjectIdParameter): ReactElement => {
  return (
    <ProjectPageLayout
      projectId={createProjectId(projectId)}
      mode="graph"
      getNavigationLevel={(project) => ({
        title: `Project ${project.name} Graph`,
        link: `/project/${projectId}/graph`,
      })}
      tasksContainerComponent={TaskGraphCanvas}
    />
  );
};
