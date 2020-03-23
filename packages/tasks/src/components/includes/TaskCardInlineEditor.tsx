import React, { ReactElement, ChangeEvent } from 'react';

import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useSelector } from 'react-redux';

import { TaskId, ProjectId } from '../../models/ids';
import { ReduxStoreTask, ReduxStoreState, ReduxStoreProject } from '../../models/redux-store-types';
import { sanctionedColorMapping } from '../../util/constants';
import useFormManager from '../hooks/useFormManager';
import { useNonCycleFormingDependencies } from '../hooks/useTasks';
import styles from './TaskCardInlineEditor.module.css';

type EditableTask = {
  readonly projectId: ProjectId | undefined;
  readonly name: string;
  readonly content: string;
  readonly dependencies: readonly TaskId[];
};

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
  const { projectId, name, content, dependencies } = editableTask;
  const projects = useSelector((state: ReduxStoreState) => state.projects);
  const [allDependenciesTaskOptions, eligibleOptions] = useNonCycleFormingDependencies(
    taskId,
    projectId,
    dependencies
  ) as readonly [ReduxStoreTask[], ReduxStoreTask[]];

  const projectList = Object.values(projects);

  return (
    <>
      <CardContent>
        <FormGroup row={false}>
          <Autocomplete
            disabled={initialProjectId !== undefined}
            className={styles.FormElement}
            options={projectList}
            autoHighlight
            getOptionLabel={(option) => option.name}
            renderOption={(option) => {
              const color = sanctionedColorMapping[projects[option.projectId].color];
              return (
                <>
                  <span className={styles.ColorDot} style={{ backgroundColor: color }} />
                  <span>{option.name}</span>
                </>
              );
            }}
            value={projectId === undefined ? null : projects[projectId]}
            onChange={(_: ChangeEvent<{}>, value: ReduxStoreProject | null) => {
              setPartialEditableTask({ projectId: value == null ? undefined : value.projectId });
            }}
            renderInput={(params) => (
              // eslint-disable-next-line react/jsx-props-no-spreading
              <TextField label="Project" type="text" {...params} />
            )}
          />
          <TextField
            className={styles.FormElement}
            label="Name"
            type="text"
            value={name}
            onChange={(event) => setPartialEditableTask({ name: event.currentTarget.value })}
          />
          <TextField
            className={styles.FormElement}
            label="Content"
            type="text"
            value={content}
            onChange={(event) => setPartialEditableTask({ content: event.currentTarget.value })}
            multiline
          />
          <Autocomplete
            multiple
            key={projectId || 'none'}
            disabled={projectId === undefined}
            className={styles.FormElement}
            options={eligibleOptions}
            autoHighlight
            getOptionLabel={(option) => option.name}
            renderOption={(option) => {
              const color = sanctionedColorMapping[projects[option.projectId].color];
              return (
                <>
                  <span className={styles.ColorDot} style={{ backgroundColor: color }} />
                  <span>{option.name}</span>
                </>
              );
            }}
            value={(() => {
              const tasks: ReduxStoreTask[] = [];
              for (let i = 0; i < dependencies.length; i += 1) {
                const id = dependencies[i];
                const task = allDependenciesTaskOptions.find((oneTask) => oneTask.taskId === id);
                if (task == null) {
                  return [];
                }
                tasks.push(task);
              }
              return tasks;
            })()}
            onChange={(_, values) => {
              setPartialEditableTask({ dependencies: values.map((task) => task.taskId) });
            }}
            renderInput={(params) => (
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
          disabled={name.trim().length === 0 || editableTask.projectId === undefined}
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
