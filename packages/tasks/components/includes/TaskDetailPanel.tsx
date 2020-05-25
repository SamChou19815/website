import React, { ReactElement } from 'react';

import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';

import { TaskId } from '../../models/ids';
import TaskDetailContainer from './TaskDetailContainer';
import styles from './TaskDetailPanel.module.css';

type Props = {
  readonly taskId: TaskId;
  readonly className?: string;
  readonly onClose: () => void;
};

const TaskDetailPanel = ({
  taskId,
  className: additionalClassName,
  onClose,
}: Props): ReactElement => {
  const className =
    additionalClassName === undefined
      ? styles.TaskDetailFloatingContainer
      : `${styles.TaskDetailFloatingContainer} ${additionalClassName}`;

  return (
    <div className={className}>
      <AppBar position="fixed" className={styles.TaskDetailAppBar} color="secondary">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6">Task Detail</Typography>
        </Toolbar>
      </AppBar>
      <TaskDetailContainer
        taskId={taskId}
        onClose={onClose}
        className={`content-below-appbar ${styles.TaskDetailContent}`}
      />
    </div>
  );
};

export default TaskDetailPanel;
