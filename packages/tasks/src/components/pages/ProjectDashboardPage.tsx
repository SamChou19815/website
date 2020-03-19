import React, { ReactElement, useState } from 'react';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { useSelector } from 'react-redux';

import { createProjectId } from '../../models/ids';
import { ReduxStoreState } from '../../models/redux-store-types';
import TaskCard from '../includes/TaskCard';
import TaskCardCreator from '../includes/TaskCardCreator';
import MaterialThemedNavigableAppContainer from '../util/MaterialThemedNavigableAppContainer';
import styles from './ProjectDashboardPage.module.css';
import { RouteComponentsWithProjectIdParameter } from './router-types';

export default ({
  match: {
    params: { projectId }
  }
}: RouteComponentsWithProjectIdParameter): ReactElement => {
  const projectsAndTasks = useSelector((state: ReduxStoreState) => {
    const project = state.projects[projectId];
    if (project == null) {
      return null;
    }
    return [
      state.projects[projectId],
      Object.values(state.tasks).filter(task => task.projectId === projectId)
    ] as const;
  });
  const [inCreationMode, setInCreationMode] = useState(false);

  if (projectsAndTasks === null) {
    // TODO: consider the case of public project.
    return <div>Project {projectId} does not exist in your account.</div>;
  }
  const [project, tasks] = projectsAndTasks;

  return (
    <MaterialThemedNavigableAppContainer
      nestedNavigationLevels={[{ title: `Project ${project.name}`, link: `/project/${projectId}` }]}
    >
      <div>
        <section>
          {inCreationMode && (
            <TaskCardCreator
              projectId={createProjectId(projectId)}
              onSave={() => setInCreationMode(false)}
            />
          )}
          {tasks.map(task => (
            <TaskCard key={task.taskId} task={task} />
          ))}
        </section>
        <Fab color="primary" className={styles.AddTaskFab} onClick={() => setInCreationMode(true)}>
          <AddIcon />
        </Fab>
      </div>
    </MaterialThemedNavigableAppContainer>
  );
};
