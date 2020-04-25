import React, { ReactElement } from 'react';

import { useSelector } from 'react-redux';

import { flattenedTopologicalSort } from '../../models/redux-store-task';
import { ReduxStoreState } from '../../models/redux-store-types';
import ProjectPageWithContent from '../includes/ProjectPageWithContent';
import ConfiguredMainAppBarrier from '../util/ConfiguredMainAppBarrier';
import UnauthorizedPage from './UnauthorizedPage';
import { RouteComponentsWithProjectIdParameter } from './router-types';

const ProjectPage = ({ projectId }: { readonly projectId: string }): ReactElement => {
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
    return <UnauthorizedPage />;
  }
  const [project, tasks] = userProjectAndTasks;

  return <ProjectPageWithContent project={project} tasks={tasks} />;
};

export default ({
  match: {
    params: { projectId },
  },
}: RouteComponentsWithProjectIdParameter): ReactElement => {
  const Component = (): ReactElement => <ProjectPage projectId={projectId} />;

  return <ConfiguredMainAppBarrier appComponent={Component} />;
};
