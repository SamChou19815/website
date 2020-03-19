import React, { ReactElement, useState } from 'react';

import { FormControlLabel } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import MarkdownBlock from 'lib-react/MarkdownBlock';

import { ReduxStoreTask } from '../../models/redux-store-types';
import { useTransitiveDependencies } from '../hooks/useTasks';
import TaskCard from './TaskCard';
import styles from './TaskDetailPanel.module.css';

export default ({ task }: { readonly task: ReduxStoreTask }): ReactElement => {
  const [showTransitive, setShowTransitive] = useState(false);
  const transitiveDependencies = useTransitiveDependencies(task.taskId);

  const dependenciesToRender = showTransitive
    ? transitiveDependencies
    : // Direct Dependencies
      transitiveDependencies.filter(dependency => task.dependencies.includes(dependency.taskId));

  return (
    <div className={styles.TaskDetailFloatingContainer}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6">Task Detail</Typography>
        </Toolbar>
      </AppBar>
      <div className={styles.TaskDetailContent}>
        <Paper>
          <Typography variant="h6">{task.name}</Typography>
          <Divider />
          <MarkdownBlock>{task.content}</MarkdownBlock>
          <FormControlLabel
            className={styles.FormElement}
            control={
              // eslint-disable-next-line react/jsx-wrap-multilines
              <Switch
                checked={showTransitive}
                onChange={() => setShowTransitive(previous => !previous)}
              />
            }
            label={`${showTransitive ? 'Show' : 'Hide'} transitive dependencies`}
            labelPlacement="start"
          />
          <Button size="small" color="primary">
            {task.completed ? 'Uncomplete' : 'Complete'}
          </Button>
        </Paper>
        <Divider />
        {dependenciesToRender.map(dependencyTask => (
          <TaskCard key={dependencyTask.taskId} task={dependencyTask} />
        ))}
      </div>
    </div>
  );
};
