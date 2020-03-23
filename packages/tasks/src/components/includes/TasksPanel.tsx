import React, { ReactElement, useState } from 'react';

import Button from '@material-ui/core/Button';
import Masonry from 'react-masonry-css';
import { useSelector } from 'react-redux';

import { TaskId } from '../../models/ids';
import { flattenedTopologicalSort } from '../../models/redux-store-task';
import { ReduxStoreState, ReduxStoreTask } from '../../models/redux-store-types';
import useWindowSize from '../hooks/useWindowSize';
import TaskCard from './TaskCard';
import TaskCardCreator from './TaskCardCreator';
import TaskDetailPanel from './TaskDetailPanel';
import styles from './TasksPanel.module.css';

export default ({ className }: { readonly className?: string }): ReactElement => {
  const tasks = useSelector<ReduxStoreState, readonly ReduxStoreTask[]>((state) =>
    flattenedTopologicalSort(Object.values(state.tasks))
  );
  const [taskDetailPanelTaskId, setTaskDetailPanelTaskId] = useState<TaskId | null>(null);
  const [inCreationMode, setInCreationMode] = useState(false);
  const [doesShowCompletedTasks, setDoesShowCompletedTasks] = useState(false);

  const breakpointColumn =
    useWindowSize(({ width }) => {
      const naiveComputedColumnCount = Math.floor(width / 400);
      return Math.max(Math.min(naiveComputedColumnCount, 3), 1);
    }) - (taskDetailPanelTaskId !== null ? 2 : 1);

  return (
    <div className={className}>
      <div className={styles.TopButtonContainer}>
        {!inCreationMode && (
          <Button
            variant="outlined"
            color="primary"
            className={styles.TopButton}
            onClick={() => setInCreationMode(true)}
            disableElevation
          >
            Create New Task
          </Button>
        )}
        <Button
          variant="outlined"
          color="primary"
          className={styles.TopButton}
          onClick={() => setDoesShowCompletedTasks((previous) => !previous)}
          disableElevation
        >
          {doesShowCompletedTasks ? 'Hide' : 'Show'} Completed Tasks
        </Button>
      </div>
      <section
        className={taskDetailPanelTaskId === null ? undefined : styles.MainTasksContainerSquezzed}
      >
        <Masonry
          breakpointCols={breakpointColumn}
          className="masonry-grid"
          columnClassName="masonry-grid-column"
        >
          {(() => {
            const children: ReactElement[] = tasks
              .filter((task) => doesShowCompletedTasks || !task.completed)
              .map((task) => (
                <TaskCard
                  key={task.taskId}
                  task={task}
                  onHeaderClick={() => setTaskDetailPanelTaskId(task.taskId)}
                />
              ));
            if (inCreationMode) {
              children.unshift(
                <TaskCardCreator key="task-creator" onSave={() => setInCreationMode(false)} />
              );
            }
            return children;
          })()}
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
