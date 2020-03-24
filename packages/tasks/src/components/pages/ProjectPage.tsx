import React, { ReactElement } from 'react';

import { useSelector } from 'react-redux';

import { flattenedTopologicalSort } from '../../models/redux-store-task';
import { ReduxStoreState } from '../../models/redux-store-types';
import ProjectPageWithContent from '../includes/ProjectPageWithContent';
import { RouteComponentsWithProjectIdParameter } from './router-types';

export default ({
  match: {
    params: { projectId },
  },
}: RouteComponentsWithProjectIdParameter): ReactElement => {
  const userProjectAndTasks = useSelector((state: ReduxStoreState) => {
    const project = state.projects[projectId];
    if (project == null) {
      return null;
    }
    const tasks = flattenedTopologicalSort(
      Object.values(state.tasks).filter((task) => task.projectId === projectId)
    );
    return [state.projects[projectId], tasks] as const;
  });

  if (userProjectAndTasks === null) {
    // TODO: consider the case of public project.
    return <div>Project {projectId} does not exist in your account.</div>;
  }
  const [project, tasks] = userProjectAndTasks;

  return <ProjectPageWithContent project={project} tasks={tasks} />;
};
