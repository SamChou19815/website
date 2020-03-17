import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { RouteComponentsWithProjectIdParameter } from './router-types';
import { ReduxStoreState, ReduxStoreTask } from '../../models/redux-store-types';
import TaskCard from '../includes/TaskCard';
import styles from './ProjectDashboardPage.module.css';

export default ({
  match: {
    params: { projectId }
  }
}: RouteComponentsWithProjectIdParameter): ReactElement => {
  const tasks = useSelector<ReduxStoreState, readonly ReduxStoreTask[] | null>(state =>
    state.projects[projectId] == null
      ? null
      : Object.values(state.tasks).filter(task => task.projectId === projectId)
  );

  if (tasks === null) {
    // TODO: consider the case of public project.
    return <div>Project {projectId} does not exist in your account.</div>;
  }

  return (
    <div>
      <section className={styles.CardContainer}>
        {tasks.map(task => (
          <TaskCard key={task.taskId} task={task} />
        ))}
      </section>
      <Fab color="primary" className={styles.AddTaskFab}>
        <AddIcon />
      </Fab>
    </div>
  );
};
