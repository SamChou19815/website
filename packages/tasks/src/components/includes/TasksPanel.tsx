import React, { ReactElement, useState } from 'react';

import Masonry from 'react-masonry-css';
import { useSelector } from 'react-redux';

import { TaskId } from '../../models/ids';
import { flattenedTopologicalSort } from '../../models/redux-store-task';
import { ReduxStoreState, ReduxStoreTask } from '../../models/redux-store-types';
import useWindowSize from '../hooks/useWindowSize';
import TaskCard from './TaskCard';
import TaskDetailPanel from './TaskDetailPanel';
import styles from './TasksPanel.module.css';

export default ({ className }: { readonly className?: string }): ReactElement => {
  const tasks = useSelector<ReduxStoreState, readonly ReduxStoreTask[]>((state) =>
    flattenedTopologicalSort(Object.values(state.tasks))
  );
  const [taskDetailPanelTaskId, setTaskDetailPanelTaskId] = useState<TaskId | null>(null);

  const breakpointColumn =
    useWindowSize(({ width }) => {
      const naiveComputedColumnCount = Math.floor(width / 400);
      return Math.max(Math.min(naiveComputedColumnCount, 3), 1);
    }) - (taskDetailPanelTaskId !== null ? 2 : 1);

  return (
    <div className={className}>
      <section
        className={taskDetailPanelTaskId === null ? undefined : styles.MainTasksContainerSquezzed}
      >
        <Masonry
          breakpointCols={breakpointColumn}
          className="masonry-grid"
          columnClassName="masonry-grid-column"
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.taskId}
              task={task}
              onHeaderClick={() => setTaskDetailPanelTaskId(task.taskId)}
            />
          ))}
        </Masonry>
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
