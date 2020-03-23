import React, { ReactElement, useState } from 'react';

import Button from '@material-ui/core/Button';
import { useSelector } from 'react-redux';

import { TaskId } from '../../models/ids';
import { flattenedTopologicalSort } from '../../models/redux-store-task';
import { ReduxStoreState, ReduxStoreTask } from '../../models/redux-store-types';
import useWindowSize from '../hooks/useWindowSize';
import MasonryTaskContainer from './MasonryTaskContainer';
import TaskCardCreator from './TaskCardCreator';
import TaskDetailPanel from './TaskDetailPanel';
import TaskGraphCanvas from './TaskGraphCanvas';
import styles from './TasksPanel.module.css';

export default ({ className }: { readonly className?: string }): ReactElement => {
  const tasks = useSelector<ReduxStoreState, readonly ReduxStoreTask[]>((state) =>
    flattenedTopologicalSort(Object.values(state.tasks))
  );
  const [mode, setMode] = useState<'dashboard' | 'graph'>('dashboard');
  const [taskDetailPanelTaskId, setTaskDetailPanelTaskId] = useState<TaskId | null>(null);
  const [inCreationMode, setInCreationMode] = useState(false);
  const [doesShowCompletedTasks, setDoesShowCompletedTasks] = useState(false);

  const breakpointColumn =
    useWindowSize(({ width }) => {
      const naiveComputedColumnCount = Math.floor(width / 400);
      return Math.max(Math.min(naiveComputedColumnCount, 3), 1);
    }) - (taskDetailPanelTaskId !== null ? 2 : 1);

  let tasksContainer: ReactElement;
  if (mode === 'dashboard') {
    tasksContainer = (
      <MasonryTaskContainer
        tasks={doesShowCompletedTasks ? tasks : tasks.filter((task) => !task.completed)}
        breakpointColumn={breakpointColumn}
        inCreationMode={inCreationMode}
        disableCreationMode={() => setInCreationMode(false)}
        onTaskClicked={setTaskDetailPanelTaskId}
      />
    );
  } else {
    tasksContainer = (
      <>
        {inCreationMode && <TaskCardCreator onSave={() => setInCreationMode(false)} />}
        <TaskGraphCanvas tasks={tasks} onTaskClicked={setTaskDetailPanelTaskId} />
      </>
    );
  }

  return (
    <div className={className}>
      <div
        className={taskDetailPanelTaskId === null ? undefined : styles.MainTasksContainerSquezzed}
      >
        <div className={styles.TopButtonContainer}>
          <Button
            variant="outlined"
            color="primary"
            className={styles.TopButton}
            onClick={() => setMode(mode === 'dashboard' ? 'graph' : 'dashboard')}
            disableElevation
          >
            To {mode === 'dashboard' ? 'Graph' : 'Dashboard'} View
          </Button>
          <Button
            variant="outlined"
            color="primary"
            className={styles.TopButton}
            onClick={() => setDoesShowCompletedTasks((previous) => !previous)}
            disableElevation
          >
            {doesShowCompletedTasks ? 'Hide' : 'Show'} Completed Tasks
          </Button>
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
        </div>
        {tasksContainer}
      </div>
      {taskDetailPanelTaskId && (
        <TaskDetailPanel
          taskId={taskDetailPanelTaskId}
          onClose={() => setTaskDetailPanelTaskId(null)}
        />
      )}
    </div>
  );
};
