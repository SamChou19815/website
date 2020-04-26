import React, { ReactElement, useState } from 'react';

import { Divider } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CheckBox from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlank from '@material-ui/icons/CheckBoxOutlineBlank';
import MarkdownBlock from 'lib-react/MarkdownBlock';

import { ReduxStoreTask } from '../../models/redux-store-types';
import { editTask, deleteTask } from '../../util/firestore-actions';
import useFormManager from '../hooks/useFormManager';
import { useTransitiveReverseDependencies } from '../hooks/useTasks';
import MaterialAlertDialog from '../util/MaterialAlertDialog';
import MaterialColoredCardHeader from '../util/MaterialColoredCardHeader';
import styles from './TaskCard.module.css';
import TaskEditorForm, { shouldBeDisabled, saveTask } from './TaskEditorForm';

type CheckBoxIconProps = { readonly completed: boolean; readonly onClick: () => void };

const CheckBoxIcon = ({ completed, onClick }: CheckBoxIconProps): ReactElement =>
  completed ? (
    <CheckBox
      className={styles.TaskCardHeaderIcon}
      onClick={onClick}
      titleAccess="Task"
      fontSize="large"
    />
  ) : (
    <CheckBoxOutlineBlank
      className={styles.TaskCardHeaderIcon}
      onClick={onClick}
      titleAccess="Task"
      fontSize="large"
    />
  );

type Props = {
  readonly task: ReduxStoreTask;
  readonly onDetailClick?: () => void;
};

export default ({
  task: { taskId, name, color, content, dependencies, completed },
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

  const className =
    completed && !inEditingMode
      ? `${styles.TaskCard} ${styles.TaskCardLessOpacity}`
      : styles.TaskCard;

  const checkIcon = (
    <CheckBoxIcon
      completed={completed}
      onClick={() => editTask({ taskId, completed: !completed })}
    />
  );

  return (
    <Card variant="outlined" className={className}>
      <MaterialColoredCardHeader
        title={inEditingMode ? editableTask.name : name}
        color={color}
        avatar={checkIcon}
        titleClassName={completed ? styles.TaskCardTitleStrikeThrough : undefined}
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
