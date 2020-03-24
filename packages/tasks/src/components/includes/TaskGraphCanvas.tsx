import React, { ReactElement } from 'react';

import Assignment from '@material-ui/icons/Assignment';
import AssignmentDone from '@material-ui/icons/AssignmentTurnedIn';
import { useSelector } from 'react-redux';

import { TaskId } from '../../models/ids';
import { ReduxStoreState, ReduxStoreTask } from '../../models/redux-store-types';
import { sanctionedColorMapping } from '../../util/constants';
import { minimizeCross, generateGraphComponents } from './TaskGraphCanvas.graph';
import styles from './TaskGraphCanvas.module.css';

type Props = {
  readonly tasks: readonly ReduxStoreTask[];
  readonly onTaskClicked: (taskId: TaskId) => void;
};

export default ({ tasks, onTaskClicked }: Props): ReactElement => {
  const colors = useSelector((state: ReduxStoreState) => {
    const colorMap: { [projectId: string]: string } = {};
    Object.entries(state.projects).forEach(([projectId, project]) => {
      colorMap[projectId] = sanctionedColorMapping[project.color];
    });
    return colorMap;
  });
  const leveledTasks = minimizeCross(tasks);

  type TaskWithPositionMap = { [taskId: string]: Readonly<{ level: number; index: number }> };
  const taskWithPositionMap: TaskWithPositionMap = {};
  leveledTasks.forEach((tasksInLevel, level) => {
    tasksInLevel.forEach((task, index) => {
      if (task === null) {
        return;
      }
      taskWithPositionMap[task.taskId] = { level, index };
    });
  });

  const {
    cards,
    icons,
    texts,
    arrows,
    canvasWidth,
    canvasHeight,
    textSize,
    iconSize,
  } = generateGraphComponents(taskWithPositionMap, leveledTasks, colors);

  const TaskIcon = ({
    task,
    completed,
    startX,
    startY,
  }: {
    readonly startX: number;
    readonly startY: number;
    readonly task: ReduxStoreTask;
    readonly completed: boolean;
  }): ReactElement =>
    completed ? (
      <AssignmentDone
        className={styles.CanvasIcon}
        x={startX}
        y={startY}
        width={iconSize}
        height={iconSize}
        onClick={() => onTaskClicked(task.taskId)}
      />
    ) : (
      <Assignment
        className={styles.CanvasIcon}
        x={startX}
        y={startY}
        width={iconSize}
        height={iconSize}
        onClick={() => onTaskClicked(task.taskId)}
      />
    );

  return (
    <svg
      className={styles.Canvas}
      width={`${canvasWidth}px`}
      height={`${canvasHeight}px`}
      style={{ width: `${canvasWidth}px` }}
    >
      {cards.map(({ task, startX, startY, width, height, color }) => (
        <rect
          key={task.taskId}
          x={startX}
          y={startY}
          width={width}
          height={height}
          opacity={task.completed ? 0.7 : 1}
          fill={color}
          className={styles.CanvasClickable}
          onClick={() => onTaskClicked(task.taskId)}
        />
      ))}
      {icons.map(({ task, completed, startX, startY }) => (
        <TaskIcon
          key={task.taskId}
          task={task}
          completed={completed}
          startX={startX}
          startY={startY}
        />
      ))}
      {texts.map(({ task, text, startX, startY, maxWidth }) => (
        <text
          key={task.taskId}
          fill="white"
          x={startX}
          y={startY}
          fontSize={textSize}
          max={maxWidth}
          className={styles.CanvasClickable}
          style={task.completed ? { textDecoration: 'line-through' } : {}}
          onClick={() => onTaskClicked(task.taskId)}
        >
          {text}
        </text>
      ))}
      {arrows.map(
        ({ id, startX, startY, endX, endY, control1X, control1Y, control2X, control2Y }) => (
          <path
            key={id}
            stroke="#3E7AE2"
            strokeWidth="2px"
            fill="none"
            d={`M${startX},${startY} C${control1X},${control1Y} ${control2X},${control2Y} ${endX},${endY}`}
          />
        )
      )}
    </svg>
  );
};
