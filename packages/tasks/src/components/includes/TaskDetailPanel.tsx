import React, { ReactElement, useState } from 'react';

import { FormControlLabel } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import MarkdownBlock from 'lib-react/MarkdownBlock';
import { useSelector } from 'react-redux';

import { TaskId } from '../../models/ids';
import { ReduxStoreState } from '../../models/redux-store-types';
import { editTask } from '../../util/firestore-actions';
import { useTransitiveDependencies } from '../hooks/useTasks';
import TaskCard from './TaskCard';
import styles from './TaskDetailPanel.module.css';

type Props = { readonly taskId: TaskId; readonly onClose: () => void };

export default ({ taskId, onClose }: Props): ReactElement => {
  const task = useSelector((state: ReduxStoreState) => state.tasks[taskId]);
  const [showTransitive, setShowTransitive] = useState(false);
  const transitiveDependencies = useTransitiveDependencies(task.taskId);

  const dependenciesToRender = showTransitive
    ? transitiveDependencies
    : // Direct Dependencies
      transitiveDependencies.filter(dependency => task.dependencies.includes(dependency.taskId));

  return (
    <div className={styles.TaskDetailFloatingContainer}>
      <AppBar position="fixed" className={styles.TaskDetailAppBar} color="secondary">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6">Task Detail</Typography>
        </Toolbar>
      </AppBar>
      <div className={styles.TaskDetailContent}>
        <Paper elevation={0}>
          <Typography variant="h6" className={styles.TaskDetailTitle}>
            {task.completed ? 'Completed' : 'Uncompleted'} Task: {task.name}
          </Typography>
          <Divider />
          <MarkdownBlock>{task.content}</MarkdownBlock>
          <Divider />
          <Box className={styles.TaskDetailActions}>
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
                  onChange={() => setShowTransitive(previous => !previous)}
                />
              }
              label={`${showTransitive ? 'Hide' : 'Show'} transitive dependencies`}
              labelPlacement="end"
            />
          </Box>
        </Paper>
        <Divider />
        {dependenciesToRender.map(dependencyTask => (
          <TaskCard key={dependencyTask.taskId} task={dependencyTask} />
        ))}
      </div>
    </div>
  );
};
