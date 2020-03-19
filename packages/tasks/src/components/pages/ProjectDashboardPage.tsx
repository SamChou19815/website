import React, { ReactElement, useState } from 'react';

import Button from '@material-ui/core/Button';
import { useSelector } from 'react-redux';

import { createProjectId, TaskId } from '../../models/ids';
import { ReduxStoreState } from '../../models/redux-store-types';
import TaskCard from '../includes/TaskCard';
import TaskCardCreator from '../includes/TaskCardCreator';
import TaskDetailPanel from '../includes/TaskDetailPanel';
import MaterialThemedNavigableAppContainer from '../util/MaterialThemedNavigableAppContainer';
import styles from './ProjectDashboardPage.module.css';
import { RouteComponentsWithProjectIdParameter } from './router-types';

export default ({
  match: {
    params: { projectId }
  }
}: RouteComponentsWithProjectIdParameter): ReactElement => {
  const projectsAndTasks = useSelector((state: ReduxStoreState) => {
    const project = state.projects[projectId];
    if (project == null) {
      return null;
    }
    return [
      state.projects[projectId],
      Object.values(state.tasks).filter(task => task.projectId === projectId)
    ] as const;
  });
  const [inCreationMode, setInCreationMode] = useState(false);
  const [taskDetailPanelTaskId, setTaskDetailPanelTaskId] = useState<TaskId | null>(null);

  if (projectsAndTasks === null) {
    // TODO: consider the case of public project.
    return <div>Project {projectId} does not exist in your account.</div>;
  }
  const [project, tasks] = projectsAndTasks;

  return (
    <MaterialThemedNavigableAppContainer
      nestedNavigationLevels={[{ title: `Project ${project.name}`, link: `/project/${projectId}` }]}
    >
      <div className="content-below-appbar">
        <section>
          {inCreationMode ? (
            <TaskCardCreator
              projectId={createProjectId(projectId)}
              onSave={() => setInCreationMode(false)}
            />
          ) : (
            <Button
              variant="outlined"
              color="primary"
              className={styles.AddTaskButton}
              onClick={() => setInCreationMode(true)}
              disableElevation
            >
              Create New Task
            </Button>
          )}
          {tasks.map(task => (
            <TaskCard
              key={task.taskId}
              task={task}
              onHeaderClick={() => setTaskDetailPanelTaskId(task.taskId)}
            />
          ))}
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
