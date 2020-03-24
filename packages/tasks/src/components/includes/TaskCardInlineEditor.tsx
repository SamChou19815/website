import React, { ReactElement } from 'react';

import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import { TaskId, ProjectId } from '../../models/ids';
import useFormManager from '../hooks/useFormManager';
import TaskEditorForm, { EditableTask } from './TaskEditorForm';

type ValidatedEditableTask = Omit<EditableTask, 'projectId'> & { readonly projectId: ProjectId };

type Props = {
  readonly taskId: TaskId | null;
  readonly initialProjectId?: ProjectId;
  readonly initialEditableTask: EditableTask;
  readonly onDiscard: () => void;
  readonly onSave: (change: ValidatedEditableTask) => void;
};

export default ({
  taskId,
  initialProjectId,
  initialEditableTask,
  onDiscard,
  onSave,
}: Props): ReactElement => {
  const [editableTask, setPartialEditableTask] = useFormManager(initialEditableTask);

  return (
    <>
      <CardContent>
        <TaskEditorForm
          taskId={taskId}
          initialProjectId={initialProjectId}
          editableTask={editableTask}
          onEdit={setPartialEditableTask}
        />
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" onClick={onDiscard}>
          Discard
        </Button>
        <Button
          size="small"
          color="primary"
          disabled={editableTask.name.trim().length === 0 || editableTask.projectId === undefined}
          onClick={() => {
            const { projectId: id } = editableTask;
            if (id === undefined) {
              throw new Error();
            }
            onSave({ ...editableTask, projectId: id });
          }}
        >
          Save
        </Button>
      </CardActions>
    </>
  );
};
