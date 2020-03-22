import React, { ReactElement, useState } from 'react';

import { useSelector } from 'react-redux';

import { TaskId } from '../../models/ids';
import { flattenedTopologicalSort } from '../../models/redux-store-task';
import { ReduxStoreState, ReduxStoreTask } from '../../models/redux-store-types';
import TaskCard from './TaskCard';
import TaskDetailPanel from './TaskDetailPanel';
import styles from './TasksPanel.module.css';

export default ({
  className: additionalClassName,
}: {
  readonly className?: string;
}): ReactElement => {
  const tasks = useSelector<ReduxStoreState, readonly ReduxStoreTask[]>((state) =>
    flattenedTopologicalSort(Object.values(state.tasks))
  );
  const [taskDetailPanelTaskId, setTaskDetailPanelTaskId] = useState<TaskId | null>(null);

  const className =
    additionalClassName === undefined
      ? styles.Container
      : `${styles.Container} ${additionalClassName}`;

  return (
    <div className={className}>
      <section className={styles.MainTasksContainer}>
        {tasks.map((task) => (
          <TaskCard
            key={task.taskId}
            task={task}
            onHeaderClick={() => setTaskDetailPanelTaskId(task.taskId)}
          />
        ))}
      </section>
      {taskDetailPanelTaskId && (
        <TaskDetailPanel
          taskId={taskDetailPanelTaskId}
          onClose={() => setTaskDetailPanelTaskId(null)}
        />
      )}
    </div>
  );
};
