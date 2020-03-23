import React, { ReactElement, useState } from 'react';

import Button from '@material-ui/core/Button';
import Masonry from 'react-masonry-css';
import { useSelector } from 'react-redux';

import { TaskId, createProjectId } from '../../models/ids';
import { flattenedTopologicalSort } from '../../models/redux-store-task';
import { ReduxStoreState } from '../../models/redux-store-types';
import useWindowSize from '../hooks/useWindowSize';
import TaskCard from '../includes/TaskCard';
import TaskCardCreator from '../includes/TaskCardCreator';
import TaskDetailPanel from '../includes/TaskDetailPanel';
import TaskGraphCanvas from '../includes/TaskGraphCanvas';
import MaterialThemedNavigableAppContainer from '../util/MaterialThemedNavigableAppContainer';
import styles from './ProjectPage.module.css';
import { RouteComponentsWithProjectIdParameter } from './router-types';

type Mode = 'dashboard' | 'graph';

export default ({
  match: {
    params: { projectId: projectIdString },
  },
}: RouteComponentsWithProjectIdParameter): ReactElement => {
  const projectId = createProjectId(projectIdString);

  const [mode, setMode] = useState<Mode>('dashboard');
  const [taskDetailPanelTaskId, setTaskDetailPanelTaskId] = useState<TaskId | null>(null);
  const [doesShowCompletedTasks, setDoesShowCompletedTasks] = useState(true);
  const [inCreationMode, setInCreationMode] = useState(false);

  const breakpointColumn =
    useWindowSize(({ width }) => {
      const naiveComputedColumnCount = Math.floor(width / 400);
      return Math.max(Math.min(naiveComputedColumnCount, 3), 1);
    }) - (taskDetailPanelTaskId !== null ? 1 : 0);

  const projectsAndTasks = useSelector((state: ReduxStoreState) => {
    const project = state.projects[projectId];
    if (project == null) {
      return null;
    }
    const tasks = flattenedTopologicalSort(
      Object.values(state.tasks).filter((task) => task.projectId === projectId)
    );
    return [
      state.projects[projectId],
      doesShowCompletedTasks ? tasks : tasks.filter((task) => !task.completed),
    ] as const;
  });

  if (projectsAndTasks === null) {
    // TODO: consider the case of public project.
    return <div>Project {projectId} does not exist in your account.</div>;
  }
  const [project, tasks] = projectsAndTasks;

  let taskContainer: ReactElement;
  if (mode === 'dashboard') {
    taskContainer = (
      <Masonry
        breakpointCols={breakpointColumn}
        className="masonry-grid"
        columnClassName="masonry-grid-column"
      >
        {(() => {
          const children: ReactElement[] = tasks.map((task) => (
            <TaskCard
              key={task.taskId}
              task={task}
              onHeaderClick={() => setTaskDetailPanelTaskId(task.taskId)}
            />
          ));
          if (inCreationMode) {
            children.unshift(
              <TaskCardCreator
                key="task-creator"
                initialProjectId={projectId}
                onSave={() => setInCreationMode(false)}
              />
            );
          }
          return children;
        })()}
      </Masonry>
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
        <TaskGraphCanvas tasks={tasks} onTaskClicked={setTaskDetailPanelTaskId} />
      </>
    );
  }

  return (
    <MaterialThemedNavigableAppContainer
      nestedNavigationLevels={[
        {
          title: `Project \`${project.name}\``,
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
