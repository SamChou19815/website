import React, { ReactElement, useState } from 'react';

import Button from '@material-ui/core/Button';
import { useSelector } from 'react-redux';

import { SanctionedColor } from '../../models/common-types';
import { TaskId } from '../../models/ids';
import { flattenedTopologicalSort } from '../../models/redux-store-task';
import { ReduxStoreState, ReduxStoreTask } from '../../models/redux-store-types';
import MaterialFormDialog from '../util/MaterialFormDialog';
import MasonryTaskContainer from './MasonryTaskContainer';
import TaskDetailPanel from './TaskDetailPanel';
import TaskEditorForm, { shouldBeDisabled, createNewTask } from './TaskEditorForm';
import TaskGraphCanvas from './TaskGraphCanvas';
import styles from './TasksPanel.module.css';

// Avoid creating a new empty array each time we pass it to `useFormManager`.
const initialDependencies: readonly TaskId[] = [];
export const initialEditableTask = {
  name: '',
  color: 'Blue' as SanctionedColor,
  content: '',
  dependencies: initialDependencies,
};

export default (): ReactElement => {
  const tasks = useSelector<ReduxStoreState, readonly ReduxStoreTask[]>((state) =>
    flattenedTopologicalSort(Object.values(state.tasks))
  );
  const [mode, setMode] = useState<'dashboard' | 'graph'>('dashboard');
  const [taskDetailPanelTaskId, setTaskDetailPanelTaskId] = useState<TaskId | null>(null);

  let tasksContainer: ReactElement;
  if (mode === 'dashboard') {
    tasksContainer = (
      <MasonryTaskContainer tasks={tasks} onTaskClicked={setTaskDetailPanelTaskId} />
    );
  } else {
    tasksContainer = <TaskGraphCanvas tasks={tasks} onTaskClicked={setTaskDetailPanelTaskId} />;
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
          <MaterialFormDialog
            formTitle="Task Creator"
            initialFormValues={initialEditableTask}
            onFormSubmit={createNewTask}
            formValidator={(values) => !shouldBeDisabled(values)}
            formComponent={TaskEditorForm}
          >
            {(trigger) => (
              <Button
                variant="outlined"
                color="primary"
                className={styles.TopButton}
                onClick={trigger}
                disableElevation
              >
                Create New Task
              </Button>
            )}
          </MaterialFormDialog>
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
