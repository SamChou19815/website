import React, { ReactElement, useState } from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Assignment from '@material-ui/icons/Assignment';
import AssignmentDone from '@material-ui/icons/AssignmentTurnedIn';
import MarkdownBlock from 'lib-react/MarkdownBlock';
import { useSelector } from 'react-redux';

import { SanctionedColor } from '../../models/common-types';
import { ReduxStoreTask, ReduxStoreState } from '../../models/redux-store-types';
import { editTask, deleteTask } from '../../util/firestore-actions';
import { useTransitiveReverseDependencies } from '../hooks/useTasks';
import MaterialAlertDialog from '../util/MaterialAlertDialog';
import MaterialColoredCardHeader from '../util/MaterialColoredCardHeader';
import styles from './TaskCard.module.css';
import TaskCardInlineEditor from './TaskCardInlineEditor';

const AssignmentIcon = ({ completed }: { readonly completed: boolean }): ReactElement =>
  completed ? (
    <AssignmentDone titleAccess="Task" fontSize="large" />
  ) : (
    <Assignment titleAccess="Task" fontSize="large" />
  );

type Props = { readonly task: ReduxStoreTask; readonly onHeaderClick?: () => void };

export default ({
  task: { taskId, projectId, name, content, dependencies, completed },
  onHeaderClick
}: Props): ReactElement => {
  const color = useSelector<ReduxStoreState, SanctionedColor>(
    state => state.projects[projectId].color
  );
  const [inEditingMode, setInEditingMode] = useState(false);
  const hasReverseDependencies = useTransitiveReverseDependencies(taskId).length > 0;

  return (
    <Card variant="outlined" className={styles.TaskCard}>
      <MaterialColoredCardHeader
        title={inEditingMode ? `Editing Task ${name}` : name}
        color={color}
        avatar={<AssignmentIcon completed={completed} />}
        onClick={onHeaderClick}
      />
      {inEditingMode ? (
        <TaskCardInlineEditor
          taskId={taskId}
          projectId={projectId}
          initialEditableTask={{ name, content, dependencies }}
          onDiscard={() => setInEditingMode(false)}
          onSave={change => {
            setInEditingMode(false);
            editTask({ taskId, ...change });
          }}
        />
      ) : (
        <>
          <CardContent>
            <MarkdownBlock>{content}</MarkdownBlock>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              color="primary"
              onClick={() => editTask({ taskId, completed: !completed })}
            >
              {completed ? 'Uncomplete' : 'Complete'}
            </Button>
            <Button size="small" color="primary" onClick={() => setInEditingMode(true)}>
              Edit
            </Button>
            <MaterialAlertDialog
              alertTitle="Deleting a task?"
              alertDescription="Once deleted, the task cannot be recovered."
              onConfirm={() => deleteTask(taskId)}
            >
              {trigger => (
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
