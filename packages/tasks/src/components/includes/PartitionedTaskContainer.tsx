/* eslint-disable react/jsx-props-no-spreading */
import React, { ReactElement } from 'react';

import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

import { TaskStatus } from '../../models/common-types';
import { TaskId } from '../../models/ids';
import { partitionTaskByStatus } from '../../models/redux-store-task';
import { ReduxStoreTask } from '../../models/redux-store-types';
import { editTask } from '../../util/firestore-actions';
import styles from './PartitionedTaskContainer.module.css';
import TaskCard from './TaskCard';

type ColumnProps = {
  readonly title: string;
  readonly status: TaskStatus;
  readonly tasks: readonly ReduxStoreTask[];
  readonly onTaskClicked: (taskId: TaskId) => void;
};

const Column = ({ title, status, tasks, onTaskClicked }: ColumnProps): ReactElement => {
  return (
    <Droppable droppableId={status}>
      {(droppableProvided) => (
        <div ref={droppableProvided.innerRef}>
          <div className={styles.Column}>
            <div className={styles.Title}>{title}</div>
            <div>
              {tasks.map((task, index) => (
                <Draggable key={task.taskId} draggableId={task.taskId} index={index}>
                  {(draggableProvided) => (
                    <div
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                    >
                      <TaskCard task={task} onDetailClick={() => onTaskClicked(task.taskId)} />
                    </div>
                  )}
                </Draggable>
              ))}
              {droppableProvided.placeholder}
            </div>
          </div>
        </div>
      )}
    </Droppable>
  );
};

type Props = {
  readonly tasks: readonly ReduxStoreTask[];
  readonly onTaskClicked: (taskId: TaskId) => void;
};

export default ({ tasks, onTaskClicked }: Props): ReactElement => {
  const partitioned = partitionTaskByStatus(tasks);

  const onDragEnd = ({ source, destination }: DropResult) => {
    if (destination == null || source.droppableId === destination.droppableId) {
      return;
    }
    const oldStatus = source.droppableId as TaskStatus;
    const newStatus = destination.droppableId as TaskStatus;
    const movedTask = partitioned[oldStatus][source.index];
    editTask({ taskId: movedTask.taskId, status: newStatus });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={styles.ColumnContainer}>
        <Column
          title="To do"
          status="to-do"
          tasks={partitioned['to-do']}
          onTaskClicked={onTaskClicked}
        />
        <Column
          title="In progress"
          status="in-progress"
          tasks={partitioned['in-progress']}
          onTaskClicked={onTaskClicked}
        />
        <Column title="Done" status="done" tasks={partitioned.done} onTaskClicked={onTaskClicked} />
      </div>
    </DragDropContext>
  );
};
