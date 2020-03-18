import React, { ReactElement, useState } from 'react';
import { useSelector } from 'react-redux';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { RouteComponentsWithProjectIdParameter } from './router-types';
import { ReduxStoreState } from '../../models/redux-store-types';
import TaskCard from '../includes/TaskCard';
import TaskCardCreator from '../includes/TaskCardCreator';
import MaterialThemedAppContainer from '../util/MaterialThemedAppContainer';
import MaterialHomeButton from '../util/MaterialHomeButton';
import styles from './ProjectDashboardPage.module.css';
import { createProjectId } from '../../models/ids';

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
    <MaterialThemedAppContainer title={`Project ${project.name}`} buttons={<MaterialHomeButton />}>
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
    </MaterialThemedAppContainer>
  );
};
