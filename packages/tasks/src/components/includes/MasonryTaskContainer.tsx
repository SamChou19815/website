import React, { ReactElement } from 'react';

import Masonry from 'react-masonry-css';

import { TaskId } from '../../models/ids';
import { reorderByCompletion } from '../../models/redux-store-task';
import { ReduxStoreTask } from '../../models/redux-store-types';
import TaskCard from './TaskCard';

type Props = {
  readonly tasks: readonly ReduxStoreTask[];
  readonly breakpointColumn: number;
  readonly onTaskClicked: (taskId: TaskId) => void;
};

export default ({ tasks, breakpointColumn, onTaskClicked }: Props): ReactElement => {
  const children: ReactElement[] = reorderByCompletion(tasks).map((task) => (
    <TaskCard key={task.taskId} task={task} onDetailClick={() => onTaskClicked(task.taskId)} />
  ));

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
