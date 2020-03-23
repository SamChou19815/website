import React, { ReactElement, useState } from 'react';

import Button from '@material-ui/core/Button';
import Masonry from 'react-masonry-css';

import { createProjectId } from '../../models/ids';
import useWindowSize from '../hooks/useWindowSize';
import ProjectPageLayout, { TasksContainerComponentProps } from '../includes/ProjectPageLayout';
import TaskCard from '../includes/TaskCard';
import TaskCardCreator from '../includes/TaskCardCreator';
import styles from './ProjectDashboardPage.module.css';
import { RouteComponentsWithProjectIdParameter } from './router-types';

const TaskContainer = ({
  projectId,
  tasks,
  detailPanelIsOpen,
  onTaskClicked,
}: TasksContainerComponentProps): ReactElement => {
  const [inCreationMode, setInCreationMode] = useState(false);

  const breakpointColumn =
    useWindowSize(({ width }) => {
      const naiveComputedColumnCount = Math.floor(width / 400);
      return Math.max(Math.min(naiveComputedColumnCount, 3), 1);
    }) - (detailPanelIsOpen ? 1 : 0);

  return (
    <>
      {!inCreationMode && (
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
              onHeaderClick={() => onTaskClicked(task.taskId)}
            />
          ));
          if (inCreationMode) {
            children.unshift(
              <TaskCardCreator projectId={projectId} onSave={() => setInCreationMode(false)} />
            );
          }
          return children;
        })()}
      </Masonry>
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
      mode="dashboard"
      getNavigationLevel={(project) => ({
        title: `Project \`${project.name}\``,
        link: `/project/${projectId}`,
      })}
      tasksContainerComponent={TaskContainer}
    />
  );
};
