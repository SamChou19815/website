import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { ReduxStoreState, ReduxStoreTask } from '../../models/redux-store-types';
import TaskCard from '../includes/TaskCard';
import styles from './TasksPage.module.css';

export default (): ReactElement => {
  const tasks = useSelector<ReduxStoreState, readonly ReduxStoreTask[]>(state =>
    Object.values(state.tasks)
  );

  return (
    <div>
      <section className={styles.CardContainer}>
        {tasks.map(task => (
          <TaskCard key={task.taskId} task={task} />
        ))}
      </section>
    </div>
  );
};
