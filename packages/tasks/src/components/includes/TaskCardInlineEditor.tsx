import React, { ReactElement } from 'react';

import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useSelector } from 'react-redux';

import { TaskId, ProjectId } from '../../models/ids';
import { ReduxStoreTask, ReduxStoreState } from '../../models/redux-store-types';
import { sanctionedColorMapping } from '../../util/constants';
import { error } from '../../util/general';
import useFormManager from '../hooks/useFormManager';
import { useNonCycleFormingDependencies } from '../hooks/useTasks';
import styles from './TaskCardInlineEditor.module.css';

type EditableTask = {
  readonly name: string;
  readonly content: string;
  readonly dependencies: readonly TaskId[];
};

type Props = {
  readonly taskId: TaskId | null;
  readonly projectId: ProjectId;
  readonly initialEditableTask: EditableTask;
  readonly onDiscard: () => void;
  readonly onSave: (change: EditableTask) => void;
};

export default ({
  taskId,
  projectId,
  initialEditableTask,
  onDiscard,
  onSave
}: Props): ReactElement => {
  const [editableTask, setPartialEditableTask] = useFormManager(initialEditableTask);
  const { name, content, dependencies } = editableTask;
  const projects = useSelector((state: ReduxStoreState) => state.projects);
  const dependenciesTaskOptions = useNonCycleFormingDependencies(
    taskId,
    projectId
  ) as ReduxStoreTask[];

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
          <Autocomplete
            multiple
            className={styles.FormElement}
            options={dependenciesTaskOptions}
            autoHighlight
            getOptionLabel={option => option.name}
            renderOption={option => {
              const color = sanctionedColorMapping[projects[option.projectId].color];
              return (
                <>
                  <span className={styles.ColorDot} style={{ backgroundColor: color }} />
                  <span>{option.name}</span>
                </>
              );
            }}
            value={dependencies.map(
              id => dependenciesTaskOptions.find(task => task.taskId === id) ?? error()
            )}
            onChange={(_, values) => {
              setPartialEditableTask({ dependencies: values.map(task => task.taskId) });
            }}
            renderInput={params => (
              // eslint-disable-next-line react/jsx-props-no-spreading
              <TextField label="Dependencies" type="text" {...params} />
            )}
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
