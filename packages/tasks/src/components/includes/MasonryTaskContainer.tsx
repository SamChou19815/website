import React, { ReactElement } from 'react';

import Masonry from 'react-masonry-css';

import { TaskId, ProjectId } from '../../models/ids';
import { ReduxStoreTask } from '../../models/redux-store-types';
import TaskCard from './TaskCard';
import TaskCardCreator from './TaskCardCreator';

type Props = {
  readonly projectId?: ProjectId;
  readonly tasks: readonly ReduxStoreTask[];
  readonly breakpointColumn: number;
  readonly inCreationMode: boolean;
  readonly disableCreationMode: () => void;
  readonly onTaskClicked: (taskId: TaskId) => void;
};

export default ({
  projectId,
  tasks,
  breakpointColumn,
  inCreationMode,
  disableCreationMode,
  onTaskClicked,
}: Props): ReactElement => {
  const children: ReactElement[] = tasks.map((task) => (
    <TaskCard key={task.taskId} task={task} onHeaderClick={() => onTaskClicked(task.taskId)} />
  ));
  if (inCreationMode) {
    children.unshift(
      <TaskCardCreator
        key="task-creator"
        initialProjectId={projectId}
        onSave={disableCreationMode}
      />
    );
  }

  return (
    <Masonry
      breakpointCols={breakpointColumn}
      className="masonry-grid"
      columnClassName="masonry-grid-column"
    >
      {children}
    </Masonry>
  );
};
