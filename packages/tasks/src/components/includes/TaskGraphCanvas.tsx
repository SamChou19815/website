import React, { ReactElement, MouseEvent, useRef, useEffect } from 'react';

import { useSelector } from 'react-redux';

import { ReduxStoreState, ReduxStoreTask } from '../../models/redux-store-types';
import { sanctionedColorMapping } from '../../util/constants';
import { TasksContainerComponentProps } from './ProjectPageLayout';
import minimizeCross from './TaskGraphCanvas.graph';
import styles from './TaskGraphCanvas.module.css';

const MARGIN = 64;
const PADDING = 16;
const TEXT_SIZE = 20;
const WIDTH = 300;
const HEIGHT = 64;

const MAX_UNTRIMMED_TEXT_LENGTH = 27;

type TaskRectangle = { readonly startX: number; readonly startY: number };

type TaskGrid = readonly (readonly (ReduxStoreTask | null)[])[];

const createTaskGrid = (tasks: readonly ReduxStoreTask[]): TaskGrid => minimizeCross(tasks);

const getTaskRectangle = (level: number, index: number): TaskRectangle => ({
  startX: index * (MARGIN + WIDTH) + MARGIN / 2,
  startY: level * (MARGIN + HEIGHT) + MARGIN / 2
});

const autoTrimText = (text: string): string => {
  if (text.length < MAX_UNTRIMMED_TEXT_LENGTH) {
    return text;
  }
  return `${text.substring(0, MAX_UNTRIMMED_TEXT_LENGTH)}...`;
};

export default ({ tasks, onTaskClicked }: TasksContainerComponentProps): ReactElement => {
  const colors = useSelector((state: ReduxStoreState) => {
    const colorMap: { [projectId: string]: string } = {};
    Object.entries(state.projects).forEach(([projectId, project]) => {
      colorMap[projectId] = sanctionedColorMapping[project.color];
    });
    return colorMap;
  });
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const canvasRef = useRef<HTMLCanvasElement>(undefined!);
  const leveledTasks = createTaskGrid(tasks);

  const canvasWidth =
    (MARGIN + WIDTH) *
    leveledTasks.reduce((max, tasksInLevel) => Math.max(max, tasksInLevel.length), 0);
  const canvasHeight = (MARGIN + HEIGHT) * leveledTasks.length;

  useEffect(() => {
    const canvasContext = canvasRef.current.getContext('2d');
    if (canvasContext == null) {
      throw new Error('Invalid canvas context!');
    }

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

    canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);

    canvasContext.font = `${TEXT_SIZE}px sans-serif`;

    // Draw Task Cards
    leveledTasks.forEach((tasksInLevel, level) => {
      tasksInLevel.forEach((task, index) => {
        if (task === null) {
          return;
        }
        const { startX, startY } = getTaskRectangle(level, index);
        const color = colors[task.projectId];
        canvasContext.fillStyle = color;
        canvasContext.fillRect(startX, startY, WIDTH, HEIGHT);
        canvasContext.fillStyle = 'white';
        canvasContext.fillText(
          autoTrimText(task.name),
          startX + PADDING / 2,
          startY + TEXT_SIZE / 2 + HEIGHT / 2,
          WIDTH - PADDING
        );
      });
    });

    // Draw Dependency Arrows
    leveledTasks.forEach((tasksInLevel, level) => {
      tasksInLevel.forEach((task, index) => {
        if (task === null) {
          return;
        }
        const { startX: endX, startY: endY } = getTaskRectangle(level, index);
        task.dependencies.forEach(dependentTaskId => {
          const dependentTaskWithPosition = taskWithPositionMap[dependentTaskId];
          if (dependentTaskWithPosition == null) {
            return;
          }
          const { startX, startY } = getTaskRectangle(
            dependentTaskWithPosition.level,
            dependentTaskWithPosition.index
          );
          canvasContext.beginPath();
          canvasContext.moveTo(startX + WIDTH / 2, startY + HEIGHT);
          canvasContext.quadraticCurveTo(
            endX + WIDTH / 2 - ((endX - startX) * 1) / 3,
            endY,
            endX + WIDTH / 2,
            endY
          );
          canvasContext.stroke();
        });
      });
    });
  }, [colors, leveledTasks, canvasWidth, canvasHeight]);

  const onCanvasClick = (event: MouseEvent<HTMLCanvasElement>): void => {
    const { clientX, clientY } = event;
    const canvas = canvasRef.current;
    const relativeX =
      clientX + document.body.scrollLeft + document.documentElement.scrollLeft - canvas.offsetLeft;
    const relativeY =
      clientY + document.body.scrollTop + document.documentElement.scrollTop - canvas.offsetTop;

    leveledTasks.forEach((tasksInLevel, level) => {
      tasksInLevel.forEach((task, index) => {
        if (task === null) {
          return;
        }
        const rectangle = getTaskRectangle(level, index);
        if (
          relativeX >= rectangle.startX &&
          relativeX <= rectangle.startX + WIDTH &&
          relativeY >= rectangle.startY &&
          relativeY <= rectangle.startY + HEIGHT
        ) {
          onTaskClicked(task.taskId);
        }
      });
    });
  };

  return (
    <canvas
      ref={canvasRef}
      className={styles.Canvas}
      onClick={onCanvasClick}
      width={`${canvasWidth}px`}
      height={`${canvasHeight}px`}
      style={{ width: `${canvasWidth}px` }}
    />
  );
};
