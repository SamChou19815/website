import React, { ReactElement, useState } from 'react';

import { FormControlLabel } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import MarkdownBlock from 'lib-react/MarkdownBlock';
import { useSelector } from 'react-redux';

import { TaskId } from '../../models/ids';
import { flattenedTopologicalSort } from '../../models/redux-store-task';
import { ReduxStoreState } from '../../models/redux-store-types';
import { editTask } from '../../util/firestore-actions';
import { useTransitiveDependencies } from '../hooks/useTasks';
import TaskCard from './TaskCard';
import styles from './TaskDetailContainer.module.css';

type Props = {
  readonly taskId: TaskId;
  readonly className?: string;
  readonly onClose: () => void;
};

export default ({ taskId, className, onClose }: Props): ReactElement => {
  const task = useSelector((state: ReduxStoreState) => state.tasks[taskId]);
  const [showTransitive, setShowTransitive] = useState(false);
  const transitiveDependencies = flattenedTopologicalSort(useTransitiveDependencies(task.taskId));

  const dependenciesToRender = showTransitive
    ? transitiveDependencies
    : // Direct Dependencies
      transitiveDependencies.filter((dependency) => task.dependencies.includes(dependency.taskId));

  return (
    <div className={className}>
      <Paper elevation={0}>
        <Typography
          variant="h6"
          className={styles.TaskDetailContent}
          style={task.completed ? { textDecoration: 'line-through' } : undefined}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="close"
            onClick={onClose}
            className={styles.TaskDetailCloseButton}
          >
            <CloseIcon />
          </IconButton>
          {task.name}
        </Typography>
        <Divider />
        {task.content && (
          <>
            <MarkdownBlock className={styles.TaskDetailContent}>
              {task.content || '`Content not provided`'}
            </MarkdownBlock>
            <Divider />
          </>
        )}
        <Box className={styles.TaskDetailContent}>
          <Button
            size="small"
            color="primary"
            className={styles.TaskDetailActionElement}
            onClick={() => editTask({ taskId, completed: !task.completed })}
          >
            {task.completed ? 'Uncomplete' : 'Complete'}
          </Button>
          <FormControlLabel
            className={styles.TaskDetailActionElement}
            control={
              // eslint-disable-next-line react/jsx-wrap-multilines
              <Switch
                checked={showTransitive}
                onChange={() => setShowTransitive((previous) => !previous)}
              />
            }
            label="Transitive Dependencies"
            labelPlacement="end"
          />
        </Box>
      </Paper>
      <Divider />
      {dependenciesToRender.map((dependencyTask) => (
        <TaskCard key={dependencyTask.taskId} task={dependencyTask} />
      ))}
    </div>
  );
};
