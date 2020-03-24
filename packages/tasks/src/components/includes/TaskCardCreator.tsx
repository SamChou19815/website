import React, { ReactElement } from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import AssessmentIcon from '@material-ui/icons/Assessment';
import { useSelector } from 'react-redux';

import { ProjectId, TaskId } from '../../models/ids';
import { ReduxStoreState } from '../../models/redux-store-types';
import useFormManager from '../hooks/useFormManager';
import MaterialColoredCardHeader from '../util/MaterialColoredCardHeader';
import styles from './TaskCard.module.css';
import TaskEditorForm, { shouldBeDisabled, createNewTask } from './TaskEditorForm';

type Props = {
  readonly initialProjectId?: ProjectId;
  readonly onSave: () => void;
};

const initialDependencies: readonly TaskId[] = [];

export default ({ initialProjectId, onSave }: Props): ReactElement => {
  const [editableTask, setPartialEditableTask] = useFormManager({
    projectId: initialProjectId,
    name: '',
    content: '',
    dependencies: initialDependencies,
  });
  const projects = useSelector((state: ReduxStoreState) => state.projects);
  const projectIdForColor = editableTask.projectId ?? initialProjectId;
  const color = projectIdForColor == null ? 'Blue' : projects[projectIdForColor].color;

  return (
    <Card variant="outlined" className={styles.TaskCard}>
      <MaterialColoredCardHeader
        title={editableTask.name || 'Creating Task'}
        color={color}
        avatar={<AssessmentIcon titleAccess="Task" fontSize="large" />}
      />
      <CardContent>
        <TaskEditorForm
          taskId={null}
          initialProjectId={initialProjectId}
          editableTask={editableTask}
          onEdit={setPartialEditableTask}
        />
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
