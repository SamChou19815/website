import React, { ReactElement } from 'react';

import { TaskId } from '../../models/ids';
import { partitionTaskByCompletion } from '../../models/redux-store-task';
import { ReduxStoreTask } from '../../models/redux-store-types';
import styles from './PartitionedTaskContainer.module.css';
import TaskCard from './TaskCard';

type ColumnProps = {
  readonly title: string;
  readonly tasks: readonly ReduxStoreTask[];
  readonly onTaskClicked: (taskId: TaskId) => void;
};

const Column = ({ title, tasks, onTaskClicked }: ColumnProps): ReactElement => {
  return (
    <div className={styles.Column}>
      <div className={styles.Title}>{title}</div>
      <div>
        {tasks.map((task) => (
          <TaskCard
            key={task.taskId}
            task={task}
            onDetailClick={() => onTaskClicked(task.taskId)}
          />
        ))}
      </div>
    </div>
  );
};

type Props = {
  readonly tasks: readonly ReduxStoreTask[];
  readonly onTaskClicked: (taskId: TaskId) => void;
};

export default ({ tasks, onTaskClicked }: Props): ReactElement => {
  const { uncompleted, completed } = partitionTaskByCompletion(tasks);

  return (
    <div className={styles.ColumnContainer}>
      <Column title="Uncompleted" tasks={uncompleted} onTaskClicked={onTaskClicked} />
      <Column title="Completed" tasks={completed} onTaskClicked={onTaskClicked} />
    </div>
  );
};
