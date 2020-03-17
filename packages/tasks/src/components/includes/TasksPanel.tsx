import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { ReduxStoreState, ReduxStoreTask } from '../../models/redux-store-types';
import TaskCard from './TaskCard';

export default (): ReactElement => {
  const tasks = useSelector<ReduxStoreState, readonly ReduxStoreTask[]>(state =>
    Object.values(state.tasks)
  );

  return (
    <div>
      <section>
        {tasks.map(task => (
          <TaskCard key={task.taskId} task={task} />
        ))}
      </section>
    </div>
  );
};
