import React, { ReactElement, useState } from 'react';

import Button from '@material-ui/core/Button';

import { TaskId } from '../../models/ids';
import { ReduxStoreProject, ReduxStoreTask } from '../../models/redux-store-types';
import useWindowSize from '../hooks/useWindowSize';
import MaterialThemedNavigableAppContainer from '../util/MaterialThemedNavigableAppContainer';
import MasonryTaskContainer from './MasonryTaskContainer';
import styles from './ProjectPageWithContent.module.css';
import TaskCardCreator from './TaskCardCreator';
import TaskDetailPanel from './TaskDetailPanel';
import TaskGraphCanvas from './TaskGraphCanvas';

type Props = {
  readonly writable: boolean;
  readonly project: ReduxStoreProject;
  readonly tasks: readonly ReduxStoreTask[];
};

export default ({ writable, project, tasks }: Props): ReactElement => {
  const { projectId } = project;

  const [mode, setMode] = useState<'dashboard' | 'graph'>('dashboard');
  const [taskDetailPanelTaskId, setTaskDetailPanelTaskId] = useState<TaskId | null>(null);
  const [doesShowCompletedTasks, setDoesShowCompletedTasks] = useState(true);
  const [inCreationMode, setInCreationMode] = useState(false);

  const breakpointColumn =
    useWindowSize(({ width }) => {
      const naiveComputedColumnCount = Math.floor(width / 400);
      return Math.max(Math.min(naiveComputedColumnCount, 3), 1);
    }) - (taskDetailPanelTaskId !== null ? 1 : 0);

  const filteredTasks = doesShowCompletedTasks ? tasks : tasks.filter((task) => !task.completed);

  const onTaskClicked = (taskId: TaskId) => {
    if (writable) {
      setTaskDetailPanelTaskId(taskId);
    }
  };

  let taskContainer: ReactElement;
  if (mode === 'dashboard') {
    taskContainer = (
      <MasonryTaskContainer
        projectId={projectId}
        writable={writable}
        tasks={filteredTasks}
        breakpointColumn={breakpointColumn}
        inCreationMode={inCreationMode}
        disableCreationMode={() => setInCreationMode(false)}
        onTaskClicked={onTaskClicked}
      />
    );
  } else {
    taskContainer = (
      <>
        {inCreationMode && (
          <TaskCardCreator
            key="task-creator"
            initialProjectId={projectId}
            onSave={() => setInCreationMode(false)}
          />
        )}
        <TaskGraphCanvas tasks={filteredTasks} onTaskClicked={onTaskClicked} />
      </>
    );
  }

  return (
    <MaterialThemedNavigableAppContainer
      nestedNavigationLevels={[
        {
          title: project.name,
          link: `/project/${projectId}`,
        },
      ]}
    >
      <div className="content-below-appbar">
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
            {!inCreationMode && writable && (
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
          {taskContainer}
        </div>
        {taskDetailPanelTaskId && writable && (
          <TaskDetailPanel
            taskId={taskDetailPanelTaskId}
            onClose={() => setTaskDetailPanelTaskId(null)}
          />
        )}
      </div>
    </MaterialThemedNavigableAppContainer>
  );
};
