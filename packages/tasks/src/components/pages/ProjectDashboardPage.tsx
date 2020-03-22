import React, { ReactElement, useState } from 'react';

import Button from '@material-ui/core/Button';

import { createProjectId } from '../../models/ids';
import ProjectPageLayout, { TasksContainerComponentProps } from '../includes/ProjectPageLayout';
import TaskCard from '../includes/TaskCard';
import TaskCardCreator from '../includes/TaskCardCreator';
import styles from './ProjectDashboardPage.module.css';
import { RouteComponentsWithProjectIdParameter } from './router-types';

const TaskContainer = ({
  projectId,
  tasks,
  onTaskClicked,
}: TasksContainerComponentProps): ReactElement => {
  const [inCreationMode, setInCreationMode] = useState(false);
  return (
    <>
      {inCreationMode ? (
        <TaskCardCreator projectId={projectId} onSave={() => setInCreationMode(false)} />
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
      {tasks.map((task) => (
        <TaskCard key={task.taskId} task={task} onHeaderClick={() => onTaskClicked(task.taskId)} />
      ))}
    </>
  );
};

export default ({
  match: {
    params: { projectId },
  },
}: RouteComponentsWithProjectIdParameter): ReactElement => {
  return (
    <ProjectPageLayout
      projectId={createProjectId(projectId)}
      getNavigationLevel={(project) => ({
        title: `Project ${project.name}`,
        link: `/project/${projectId}`,
      })}
      tasksContainerComponent={TaskContainer}
    />
  );
};
