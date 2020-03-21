import React, { ReactElement, useState } from 'react';

import { useSelector } from 'react-redux';

import { TaskId, ProjectId } from '../../models/ids';
import { flattenedTopologicalSort } from '../../models/redux-store-task';
import { ReduxStoreState, ReduxStoreProject, ReduxStoreTask } from '../../models/redux-store-types';
import MaterialThemedNavigableAppContainer, {
  NestedNavigationLevel
} from '../util/MaterialThemedNavigableAppContainer';
import styles from './ProjectPageLayout.module.css';
import TaskDetailPanel from './TaskDetailPanel';

export type TasksContainerComponentProps = {
  readonly projectId: ProjectId;
  readonly tasks: readonly ReduxStoreTask[];
  readonly onTaskClicked: (taskId: TaskId) => void;
};

type Props = {
  readonly projectId: ProjectId;
  readonly getNavigationLevel: (project: ReduxStoreProject) => NestedNavigationLevel;
  readonly tasksContainerComponent: (props: TasksContainerComponentProps) => ReactElement;
};

export default ({
  projectId,
  getNavigationLevel,
  tasksContainerComponent: TasksContainer
}: Props): ReactElement => {
  const projectsAndTasks = useSelector((state: ReduxStoreState) => {
    const project = state.projects[projectId];
    if (project == null) {
      return null;
    }
    return [
      state.projects[projectId],
      flattenedTopologicalSort(
        Object.values(state.tasks).filter(task => task.projectId === projectId)
      )
    ] as const;
  });

  if (projectsAndTasks === null) {
    // TODO: consider the case of public project.
    return <div>Project {projectId} does not exist in your account.</div>;
  }
  const [project, tasks] = projectsAndTasks;
  const [taskDetailPanelTaskId, setTaskDetailPanelTaskId] = useState<TaskId | null>(null);

  return (
    <MaterialThemedNavigableAppContainer nestedNavigationLevels={[getNavigationLevel(project)]}>
      <div className={`content-below-appbar ${styles.Container}`}>
        <section className={styles.MainTasksContainer}>
          <TasksContainer
            projectId={projectId}
            tasks={tasks}
            onTaskClicked={taskId => setTaskDetailPanelTaskId(taskId)}
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
