import React, { ReactElement, useState } from 'react';

import { Divider } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import MarkdownBlock from 'lib-react/MarkdownBlock';

import { TaskStatus } from '../../models/common-types';
import { ReduxStoreTask } from '../../models/redux-store-types';
import { editTask, deleteTask } from '../../util/firestore-actions';
import useFormManager from '../hooks/useFormManager';
import { useTransitiveReverseDependencies } from '../hooks/useTasks';
import MaterialAlertDialog from '../util/MaterialAlertDialog';
import MaterialColoredCardHeader from '../util/MaterialColoredCardHeader';
import CheckboxIcon from './CheckboxIcon';
import styles from './TaskCard.module.css';
import TaskEditorForm, { shouldBeDisabled, saveTask } from './TaskEditorForm';

type Props = {
  readonly task: ReduxStoreTask;
  readonly onDetailClick?: () => void;
};

export default ({
  task: { taskId, name, color, content, dependencies, status },
  onDetailClick,
}: Props): ReactElement => {
  const [inEditingMode, setInEditingMode] = useState(false);
  const hasReverseDependencies = useTransitiveReverseDependencies(taskId).length > 0;
  const [editableTask, setPartialEditableTask] = useFormManager({
    name,
    color,
    content,
    dependencies,
  });

  const onCheckboxClick = () => {
    let newStatus: TaskStatus;
    switch (status) {
      case 'to-do':
        newStatus = 'in-progress';
        break;
      case 'in-progress':
        newStatus = 'done';
        break;
      case 'done':
        newStatus = 'to-do';
        break;
    }
    editTask({ taskId, status: newStatus });
  };

  return (
    <Card variant="outlined" className={styles.TaskCard}>
      <MaterialColoredCardHeader
        title={inEditingMode ? editableTask.name : name}
        color={color}
        avatar={<CheckboxIcon status={status} onClick={onCheckboxClick} />}
      />
      {inEditingMode ? (
        <>
          <CardContent>
            <TaskEditorForm
              taskId={taskId}
              values={editableTask}
              onChange={setPartialEditableTask}
            />
          </CardContent>
          <CardActions>
            <Button size="small" color="primary" onClick={() => setInEditingMode(false)}>
              Discard
            </Button>
            <Button
              size="small"
              color="primary"
              disabled={shouldBeDisabled(editableTask)}
              onClick={() => {
                setInEditingMode(false);
                saveTask(taskId, editableTask);
              }}
            >
              Save
            </Button>
          </CardActions>
        </>
      ) : (
        <>
          {content && (
            <>
              <CardContent>
                <MarkdownBlock>{content}</MarkdownBlock>
              </CardContent>
              <Divider />
            </>
          )}
          <CardActions>
            <Button size="small" color="primary" onClick={onDetailClick}>
              Details
            </Button>
            <Button size="small" color="primary" onClick={() => setInEditingMode(true)}>
              Edit
            </Button>
            <MaterialAlertDialog
              alertTitle="Deleting a task?"
              alertDescription="Once deleted, the task cannot be recovered."
              onConfirm={() => deleteTask(taskId)}
            >
              {(trigger) => (
                <Button
                  size="small"
                  color="primary"
                  disabled={hasReverseDependencies}
                  onClick={trigger}
                >
                  Delete
                </Button>
              )}
            </MaterialAlertDialog>
          </CardActions>
        </>
      )}
    </Card>
  );
};
