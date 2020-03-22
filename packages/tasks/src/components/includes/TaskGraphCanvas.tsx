import React, { ReactElement, MouseEvent, useRef, useEffect } from 'react';

import { useSelector } from 'react-redux';

import { ReduxStoreState } from '../../models/redux-store-types';
import { sanctionedColorMapping } from '../../util/constants';
import { TasksContainerComponentProps } from './ProjectPageLayout';
import { minimizeCross, generateGraphComponents, clickTask } from './TaskGraphCanvas.graph';
import styles from './TaskGraphCanvas.module.css';

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

  const graphComponents = generateGraphComponents(taskWithPositionMap, leveledTasks, colors);

  const onCanvasClick = (event: MouseEvent<HTMLCanvasElement>): void => {
    const { clientX, clientY } = event;
    const canvas = canvasRef.current;
    const relativeX =
      clientX + document.body.scrollLeft + document.documentElement.scrollLeft - canvas.offsetLeft;
    const relativeY =
      clientY + document.body.scrollTop + document.documentElement.scrollTop - canvas.offsetTop;

    clickTask(leveledTasks, relativeX, relativeY, onTaskClicked);
  };

  useEffect(() => {
    const canvasContext = canvasRef.current.getContext('2d');
    if (canvasContext == null) {
      throw new Error('Invalid canvas context!');
    }

    const { cards, texts, arrows, canvasWidth, canvasHeight, textSize } = graphComponents;

    canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw Cards
    cards.forEach(({ startX, startY, width, height, color }) => {
      canvasContext.fillStyle = color;
      canvasContext.fillRect(startX, startY, width, height);
    });

    // Draw Text
    canvasContext.font = `${textSize}px sans-serif`;
    canvasContext.fillStyle = 'white';
    texts.forEach(({ text, startX, startY, maxWidth }) => {
      canvasContext.fillText(text, startX, startY, maxWidth);
    });

    // Draw Dependency Arrows
    arrows.forEach(({ startX, startY, endX, endY, controlX, controlY }) => {
      canvasContext.beginPath();
      canvasContext.moveTo(startX, startY);
      canvasContext.quadraticCurveTo(controlX, controlY, endX, endY);
      canvasContext.stroke();
    });
  }, [graphComponents]);

  return (
    <canvas
      ref={canvasRef}
      className={styles.Canvas}
      onClick={onCanvasClick}
      width={`${graphComponents.canvasWidth}px`}
      height={`${graphComponents.canvasHeight}px`}
      style={{ width: `${graphComponents.canvasWidth}px` }}
    />
  );
};
