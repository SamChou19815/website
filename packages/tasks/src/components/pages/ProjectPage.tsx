import React, { ReactElement, useState } from 'react';

import Masonry from 'react-masonry-css';

import { createProjectId, ProjectId } from '../../models/ids';
import useWindowSize from '../hooks/useWindowSize';
import ProjectPageLayout, {
  Mode,
  TasksContainerComponentProps,
} from '../includes/ProjectPageLayout';
import TaskCard from '../includes/TaskCard';
import TaskCardCreator from '../includes/TaskCardCreator';
import TaskGraphCanvas from '../includes/TaskGraphCanvas';
import { RouteComponentsWithProjectIdParameter } from './router-types';

type TaskContainerAdditionalProps = {
  readonly projectId: ProjectId;
  readonly inCreationMode: boolean;
  readonly disableCreation: () => void;
};

const TaskContainer = ({
  projectId,
  tasks,
  detailPanelIsOpen,
  onTaskClicked,
  inCreationMode,
  disableCreation,
}: TasksContainerComponentProps & TaskContainerAdditionalProps): ReactElement => {
  const breakpointColumn =
    useWindowSize(({ width }) => {
      const naiveComputedColumnCount = Math.floor(width / 400);
      return Math.max(Math.min(naiveComputedColumnCount, 3), 1);
    }) - (detailPanelIsOpen ? 1 : 0);

  return (
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
            <TaskCardCreator
              key="task-creator"
              initialProjectId={projectId}
              onSave={disableCreation}
            />
          );
        }
        return children;
      })()}
    </Masonry>
  );
};

export default ({
  match: {
    params: { projectId: projectIdString },
  },
}: RouteComponentsWithProjectIdParameter): ReactElement => {
  const [mode, setMode] = useState<Mode>('dashboard');
  const [inCreationMode, setInCreationMode] = useState(false);
  const projectId = createProjectId(projectIdString);

  if (mode === 'dashboard') {
    const additionalButton = inCreationMode
      ? undefined
      : (['Create New Task', () => setInCreationMode(true)] as const);

    return (
      <ProjectPageLayout
        projectId={projectId}
        mode={mode}
        onModeSwitch={setMode}
        additionalProps={{
          projectId,
          inCreationMode,
          disableCreation: () => setInCreationMode(false),
        }}
        additionalButton={additionalButton}
        tasksContainerComponent={TaskContainer}
      />
    );
  }

  return (
    <ProjectPageLayout
      projectId={projectId}
      mode="graph"
      onModeSwitch={setMode}
      additionalProps={{}}
      tasksContainerComponent={TaskGraphCanvas}
    />
  );
};
