import React, { ReactElement, useState } from 'react';

import Button from '@material-ui/core/Button';
import { useSelector } from 'react-redux';

import { TaskId, ProjectId } from '../../models/ids';
import { flattenedTopologicalSort } from '../../models/redux-store-task';
import { ReduxStoreState, ReduxStoreTask } from '../../models/redux-store-types';
import MaterialThemedNavigableAppContainer from '../util/MaterialThemedNavigableAppContainer';
import styles from './ProjectPageLayout.module.css';
import TaskDetailPanel from './TaskDetailPanel';

export type Mode = 'dashboard' | 'graph';

export type TasksContainerComponentProps = {
  readonly tasks: readonly ReduxStoreTask[];
  readonly onTaskClicked: (taskId: TaskId) => void;
  readonly detailPanelIsOpen: boolean;
};

type Props<P extends {}> = {
  readonly projectId: ProjectId;
  readonly mode: Mode;
  readonly onModeSwitch: (mode: Mode) => void;
  readonly additionalProps: P;
  readonly additionalButton?: readonly [string, () => void];
  readonly tasksContainerComponent: (props: TasksContainerComponentProps & P) => ReactElement;
};

export default <P extends {} = {}>({
  projectId,
  mode,
  onModeSwitch,
  additionalProps,
  additionalButton,
  tasksContainerComponent: TasksContainer,
}: Props<P>): ReactElement => {
  const projectsAndTasks = useSelector((state: ReduxStoreState) => {
    const project = state.projects[projectId];
    if (project == null) {
      return null;
    }
    return [
      state.projects[projectId],
      flattenedTopologicalSort(
        Object.values(state.tasks).filter((task) => task.projectId === projectId)
      ),
    ] as const;
  });

  if (projectsAndTasks === null) {
    // TODO: consider the case of public project.
    return <div>Project {projectId} does not exist in your account.</div>;
  }
  const [project, tasks] = projectsAndTasks;
  const [taskDetailPanelTaskId, setTaskDetailPanelTaskId] = useState<TaskId | null>(null);
  const [doesShowCompletedTasks, setDoesShowCompletedTasks] = useState(false);

  const filteredTasks = doesShowCompletedTasks ? tasks : tasks.filter((task) => !task.completed);

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
              onClick={() => onModeSwitch(mode === 'dashboard' ? 'graph' : 'dashboard')}
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
            {additionalButton && (
              <Button
                variant="outlined"
                color="primary"
                className={styles.TopButton}
                onClick={additionalButton[1]}
                disableElevation
              >
                {additionalButton[0]}
              </Button>
            )}
          </div>
          <TasksContainer
            projectId={projectId}
            tasks={filteredTasks}
            detailPanelIsOpen={taskDetailPanelTaskId !== null}
            onTaskClicked={(taskId) => setTaskDetailPanelTaskId(taskId)}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...additionalProps}
          />
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
