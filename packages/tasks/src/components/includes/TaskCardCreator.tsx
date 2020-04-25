import React, { ReactElement } from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import AssessmentIcon from '@material-ui/icons/Assessment';

import { SanctionedColor } from '../../models/common-types';
import { TaskId } from '../../models/ids';
import useFormManager from '../hooks/useFormManager';
import MaterialColoredCardHeader from '../util/MaterialColoredCardHeader';
import styles from './TaskCard.module.css';
import TaskEditorForm, { shouldBeDisabled, createNewTask } from './TaskEditorForm';

type Props = { readonly onSave: () => void };

// Avoid creating a new empty array each time we pass it to `useFormManager`.
const initialDependencies: readonly TaskId[] = [];

export default ({ onSave }: Props): ReactElement => {
  const [editableTask, setPartialEditableTask] = useFormManager({
    name: '',
    color: 'Blue' as SanctionedColor,
    content: '',
    dependencies: initialDependencies,
  });

  return (
    <Card variant="outlined" className={styles.TaskCard}>
      <MaterialColoredCardHeader
        title={editableTask.name || 'Creating Task'}
        color={editableTask.color}
        avatar={<AssessmentIcon titleAccess="Task" fontSize="large" />}
      />
      <CardContent>
        <TaskEditorForm taskId={null} editableTask={editableTask} onEdit={setPartialEditableTask} />
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" onClick={onSave}>
          Discard
        </Button>
        <Button
          size="small"
          color="primary"
          disabled={shouldBeDisabled(editableTask)}
          onClick={() => {
            onSave();
            createNewTask(editableTask);
          }}
        >
          Save
        </Button>
      </CardActions>
    </Card>
  );
};
