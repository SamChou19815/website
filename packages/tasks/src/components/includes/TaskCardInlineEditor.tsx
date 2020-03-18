import React, { ReactElement } from 'react';

import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';

import { TaskId } from '../../models/ids';
import useFormManager from '../hooks/useFormManager';
import styles from './TaskCardInlineEditor.module.css';

type EditableTask = {
  readonly name: string;
  readonly content: string;
  readonly dependencies: readonly TaskId[];
};

type Props = {
  readonly initialEditableTask: EditableTask;
  readonly onDiscard: () => void;
  readonly onSave: (change: EditableTask) => void;
};

export default ({ initialEditableTask, onDiscard, onSave }: Props): ReactElement => {
  const [editableTask, setPartialEditableTask] = useFormManager(initialEditableTask);
  const { name, content } = editableTask;

  return (
    <>
      <CardContent>
        <FormGroup row={false}>
          <TextField
            className={styles.FormElement}
            label="Name"
            type="text"
            value={name}
            onChange={event => setPartialEditableTask({ name: event.currentTarget.value })}
          />
          <TextField
            className={styles.FormElement}
            label="Content"
            type="text"
            value={content}
            onChange={event => setPartialEditableTask({ content: event.currentTarget.value })}
            multiline
          />
        </FormGroup>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" onClick={onDiscard}>
          Discard
        </Button>
        <Button
          size="small"
          color="primary"
          disabled={name.trim().length === 0}
          onClick={() => onSave(editableTask)}
        >
          Save
        </Button>
      </CardActions>
    </>
  );
};
