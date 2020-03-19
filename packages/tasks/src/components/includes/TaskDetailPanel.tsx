import React, { ReactElement } from 'react';

import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';

import { TaskId } from '../../models/ids';
import TaskDetailContainer from './TaskDetailContainer';
import styles from './TaskDetailPanel.module.css';

type Props = { readonly taskId: TaskId; readonly onClose: () => void };

export default ({ taskId, onClose }: Props): ReactElement => {
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
      <TaskDetailContainer taskId={taskId} className="content-below-appbar" />
    </div>
  );
};
