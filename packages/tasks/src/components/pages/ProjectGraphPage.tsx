import React, { ReactElement } from 'react';

import { createProjectId } from '../../models/ids';
import ProjectPageLayout, { TasksContainerComponentProps } from '../includes/ProjectPageLayout';
import { RouteComponentsWithProjectIdParameter } from './router-types';

const TaskContainer = ({ projectId }: TasksContainerComponentProps): ReactElement => {
  return <>Graph view for project {projectId} has not been implemented yet.</>;
};

export default ({
  match: {
    params: { projectId }
  }
}: RouteComponentsWithProjectIdParameter): ReactElement => {
  return (
    <ProjectPageLayout
      projectId={createProjectId(projectId)}
      getNavigationLevel={project => ({
        title: `Project ${project.name} Graph`,
        link: `/project/${projectId}/graph`
      })}
      tasksContainerComponent={TaskContainer}
    />
  );
};
