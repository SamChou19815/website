import React, { ReactElement, useState } from 'react';

import Button from '@material-ui/core/Button';
import { useSelector } from 'react-redux';

import { TaskId } from '../../models/ids';
import { flattenedTopologicalSort, reorderByCompletion } from '../../models/redux-store-task';
import { ReduxStoreState, ReduxStoreTask } from '../../models/redux-store-types';
import useWindowSize from '../hooks/useWindowSize';
import MasonryTaskContainer from './MasonryTaskContainer';
import TaskCardCreator from './TaskCardCreator';
import TaskDetailPanel from './TaskDetailPanel';
import TaskGraphCanvas from './TaskGraphCanvas';
import styles from './TasksPanel.module.css';

export default (): ReactElement => {
  const tasks = useSelector<ReduxStoreState, readonly ReduxStoreTask[]>((state) =>
    reorderByCompletion(flattenedTopologicalSort(Object.values(state.tasks)))
  );
  const [mode, setMode] = useState<'dashboard' | 'graph'>('dashboard');
  const [taskDetailPanelTaskId, setTaskDetailPanelTaskId] = useState<TaskId | null>(null);
  const [inCreationMode, setInCreationMode] = useState(false);

  const breakpointColumn =
    useWindowSize(({ width }) => {
      const naiveComputedColumnCount = Math.floor(width / 350);
      return Math.max(Math.min(naiveComputedColumnCount, 4), 1);
    }) - (taskDetailPanelTaskId !== null ? 1 : 0);

  let tasksContainer: ReactElement;
  if (mode === 'dashboard') {
    tasksContainer = (
      <MasonryTaskContainer
        tasks={tasks}
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
    <div>
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
