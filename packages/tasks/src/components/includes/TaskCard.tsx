import React, { ReactElement, useState } from 'react';

import { Divider } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import AssignmentDone from '@material-ui/icons/AssignmentTurnedIn';
import CheckBoxOutlineBlank from '@material-ui/icons/CheckBoxOutlineBlank';
import MarkdownBlock from 'lib-react/MarkdownBlock';
import { useSelector } from 'react-redux';

import { ReduxStoreTask, ReduxStoreState } from '../../models/redux-store-types';
import { editTask, deleteTask } from '../../util/firestore-actions';
import useFormManager from '../hooks/useFormManager';
import { useTransitiveReverseDependencies } from '../hooks/useTasks';
import MaterialAlertDialog from '../util/MaterialAlertDialog';
import MaterialColoredCardHeader from '../util/MaterialColoredCardHeader';
import styles from './TaskCard.module.css';
import TaskEditorForm, { shouldBeDisabled, saveTask } from './TaskEditorForm';

type AssignmentIconProps = { readonly completed: boolean; readonly onClick: () => void };

const AssignmentIcon = ({ completed, onClick }: AssignmentIconProps): ReactElement =>
  completed ? (
    <AssignmentDone
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
  readonly writable: boolean;
  readonly onDetailClick?: () => void;
};

export default ({
  task: { taskId, projectId, name, content, dependencies, completed },
  writable,
  onDetailClick,
}: Props): ReactElement => {
  const project = useSelector((state: ReduxStoreState) => state.projects[projectId]);
  const color = project?.color ?? 'Blue';

  const [inEditingMode, setInEditingMode] = useState(false);
  const hasReverseDependencies = useTransitiveReverseDependencies(taskId).length > 0;
  const [editableTask, setPartialEditableTask] = useFormManager({
    projectId,
    name,
    content,
    dependencies,
  });

  const className =
    completed && !inEditingMode
      ? `${styles.TaskCard} ${styles.TaskCardLessOpacity}`
      : styles.TaskCard;

  const assignmentIcon = (
    <AssignmentIcon
      completed={completed}
      onClick={() => editTask({ taskId, completed: !completed })}
    />
  );

  return (
    <Card variant="outlined" className={className}>
      <MaterialColoredCardHeader
        title={inEditingMode ? editableTask.name : name}
        color={color}
        avatar={assignmentIcon}
        titleClassName={completed ? styles.TaskCardTitleStrikeThrough : undefined}
      />
      {inEditingMode ? (
        <>
          <CardContent>
            <TaskEditorForm
              taskId={taskId}
              initialProjectId={projectId}
              editableTask={editableTask}
              onEdit={setPartialEditableTask}
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
          {writable && (
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
          )}
        </>
      )}
    </Card>
  );
};
