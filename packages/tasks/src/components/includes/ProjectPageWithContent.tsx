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
  readonly project: ReduxStoreProject;
  readonly tasks: readonly ReduxStoreTask[];
};

export default ({ project, tasks }: Props): ReactElement => {
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

  let taskContainer: ReactElement;
  if (mode === 'dashboard') {
    taskContainer = (
      <MasonryTaskContainer
        projectId={projectId}
        tasks={filteredTasks}
        breakpointColumn={breakpointColumn}
        inCreationMode={inCreationMode}
        disableCreationMode={() => setInCreationMode(false)}
        onTaskClicked={setTaskDetailPanelTaskId}
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
        <TaskGraphCanvas tasks={filteredTasks} onTaskClicked={setTaskDetailPanelTaskId} />
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
          {taskContainer}
        </div>
        {taskDetailPanelTaskId && (
          <TaskDetailPanel
            taskId={taskDetailPanelTaskId}
            onClose={() => setTaskDetailPanelTaskId(null)}
          />
        )}
      </div>
    </MaterialThemedNavigableAppContainer>
  );
};
