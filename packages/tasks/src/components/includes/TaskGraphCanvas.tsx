import React, { ReactElement } from 'react';

import { useSelector } from 'react-redux';

import { createTaskId } from '../../models/ids';
import { ReduxStoreState } from '../../models/redux-store-types';
import { sanctionedColorMapping } from '../../util/constants';
import { TasksContainerComponentProps } from './ProjectPageLayout';
import { minimizeCross, generateGraphComponents } from './TaskGraphCanvas.graph';
import styles from './TaskGraphCanvas.module.css';

export default ({ tasks, onTaskClicked }: TasksContainerComponentProps): ReactElement => {
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

  const { cards, texts, arrows, canvasWidth, canvasHeight, textSize } = generateGraphComponents(
    taskWithPositionMap,
    leveledTasks,
    colors
  );

  return (
    <svg
      className={styles.Canvas}
      width={`${canvasWidth}px`}
      height={`${canvasHeight}px`}
      style={{ width: `${canvasWidth}px` }}
    >
      {cards.map(({ id, startX, startY, width, height, color }) => (
        <rect
          key={id}
          x={startX}
          y={startY}
          width={width}
          height={height}
          fill={color}
          onClick={() => onTaskClicked(createTaskId(id))}
        />
      ))}
      {texts.map(({ id, text, startX, startY, maxWidth }) => (
        <text
          key={id}
          fill="white"
          x={startX}
          y={startY}
          fontSize={textSize}
          max={maxWidth}
          onClick={() => onTaskClicked(createTaskId(id))}
        >
          {text}
        </text>
      ))}
      {arrows.map(({ id, startX, startY, endX, endY, controlX, controlY }) => (
        <path
          key={id}
          stroke="black"
          fill="none"
          d={`M${startX},${startY} Q${controlX},${controlY} ${endX},${endY}`}
        />
      ))}
    </svg>
  );
};
