import React, { ReactElement, MouseEvent, useRef, useEffect } from 'react';

import { useSelector } from 'react-redux';

import { ReduxStoreState, ReduxStoreTask } from '../../models/redux-store-types';
import { sanctionedColorMapping } from '../../util/constants';
import { TasksContainerComponentProps } from './ProjectPageLayout';
import minimizeCross from './TaskGraphCanvas.graph';
import styles from './TaskGraphCanvas.module.css';

const MARGIN = 32;
const TEXT_SIZE = 20;
const WIDTH = 300;
const HEIGHT = 64;

const MAX_UNTRIMMED_TEXT_LENGTH = 27;

type TaskRectangle = {
  readonly startX: number;
  readonly startY: number;
  readonly width: number;
  readonly height: number;
};

type TaskGrid = readonly (readonly (ReduxStoreTask | null)[])[];

const createTaskGrid = (tasks: readonly ReduxStoreTask[]): TaskGrid => minimizeCross(tasks);

const getTaskRectangle = (level: number, index: number): TaskRectangle => ({
  startX: index * (MARGIN + WIDTH) + MARGIN / 2,
  startY: level * (MARGIN + HEIGHT) + MARGIN / 2,
  width: WIDTH,
  height: HEIGHT
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

  useEffect(() => {
    const canvasContext = canvasRef.current.getContext('2d');
    if (canvasContext == null) {
      throw new Error('Invalid canvas context!');
    }
    canvasContext.imageSmoothingEnabled = true;
    canvasContext.font = `${TEXT_SIZE}px sans-serif`;
    leveledTasks.forEach((tasksInLevel, level) => {
      tasksInLevel.forEach((task, index) => {
        if (task === null) {
          return;
        }
        const { startX, startY, width, height } = getTaskRectangle(level, index);
        const color = colors[task.projectId];
        canvasContext.fillStyle = color;
        canvasContext.fillRect(startX, startY, width, height);
        canvasContext.fillStyle = 'white';
        canvasContext.fillText(
          autoTrimText(task.name),
          startX + MARGIN / 2,
          startY + MARGIN / 2 + HEIGHT / 2,
          width - MARGIN
        );
      });
    });
  }, [colors, leveledTasks]);

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
          relativeX <= rectangle.startX + rectangle.width &&
          relativeY >= rectangle.startY &&
          relativeY <= rectangle.startY + rectangle.height
        ) {
          onTaskClicked(task.taskId);
        }
      });
    });
  };

  const width =
    (MARGIN + WIDTH) *
    leveledTasks.reduce((max, tasksInLevel) => Math.max(max, tasksInLevel.length), 0);
  const height = (MARGIN + HEIGHT) * leveledTasks.length;

  return (
    <canvas
      ref={canvasRef}
      className={styles.Canvas}
      onClick={onCanvasClick}
      width={`${width}px`}
      height={`${height}px`}
      style={{ width: `${width}px` }}
    />
  );
};
