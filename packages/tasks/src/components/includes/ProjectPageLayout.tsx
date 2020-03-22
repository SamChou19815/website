import React, { ReactElement, useState } from 'react';

import { Button } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { TaskId, ProjectId } from '../../models/ids';
import { flattenedTopologicalSort } from '../../models/redux-store-task';
import { ReduxStoreState, ReduxStoreProject, ReduxStoreTask } from '../../models/redux-store-types';
import MaterialThemedNavigableAppContainer, {
  NestedNavigationLevel,
} from '../util/MaterialThemedNavigableAppContainer';
import styles from './ProjectPageLayout.module.css';
import TaskDetailPanel from './TaskDetailPanel';

type Mode = 'dashboard' | 'graph';
type ModeSwitchButtonProps = { readonly projectId: ProjectId; readonly mode: Mode };

const ModeSwitchButton = ({ projectId, mode }: ModeSwitchButtonProps): ReactElement => {
  const history = useHistory();

  const onModeSwitch = () => {
    history.push(mode === 'dashboard' ? `/project/${projectId}/graph` : `/project/${projectId}`);
  };

  return (
    <Button color="inherit" onClick={() => onModeSwitch()}>
      To {mode === 'dashboard' ? 'Graph' : 'Dashboard'}
    </Button>
  );
};

export type TasksContainerComponentProps = {
  readonly projectId: ProjectId;
  readonly tasks: readonly ReduxStoreTask[];
  readonly detailPanelIsOpen: boolean;
  readonly onTaskClicked: (taskId: TaskId) => void;
};

type Props = {
  readonly projectId: ProjectId;
  readonly mode: Mode;
  readonly getNavigationLevel: (project: ReduxStoreProject) => NestedNavigationLevel;
  readonly tasksContainerComponent: (props: TasksContainerComponentProps) => ReactElement;
};

export default ({
  projectId,
  mode,
  getNavigationLevel,
  tasksContainerComponent: TasksContainer,
}: Props): ReactElement => {
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

  return (
    <MaterialThemedNavigableAppContainer
      nestedNavigationLevels={[getNavigationLevel(project)]}
      buttons={<ModeSwitchButton projectId={projectId} mode={mode} />}
    >
      <div className="content-below-appbar">
        <section
          className={taskDetailPanelTaskId === null ? undefined : styles.MainTasksContainerSquezzed}
        >
          <TasksContainer
            projectId={projectId}
            tasks={tasks}
            detailPanelIsOpen={taskDetailPanelTaskId !== null}
            onTaskClicked={(taskId) => setTaskDetailPanelTaskId(taskId)}
          />
        </section>
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
