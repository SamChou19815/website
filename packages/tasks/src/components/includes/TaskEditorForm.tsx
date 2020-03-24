import React, { ReactElement, ChangeEvent } from 'react';

import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useSelector } from 'react-redux';

import { TaskId, ProjectId } from '../../models/ids';
import { ReduxStoreTask, ReduxStoreState, ReduxStoreProject } from '../../models/redux-store-types';
import { sanctionedColorMapping } from '../../util/constants';
import { useEligibleDependencies } from '../hooks/useTasks';
import styles from './TaskEditorForm.module.css';

export type EditableTask = {
  readonly projectId: ProjectId | undefined;
  readonly name: string;
  readonly content: string;
  readonly dependencies: readonly TaskId[];
};

type Props = {
  readonly taskId: TaskId | null;
  readonly initialProjectId?: ProjectId;
  readonly editableTask: EditableTask;
  readonly onEdit: (change: Partial<EditableTask>) => void;
};

export default ({ taskId, initialProjectId, editableTask, onEdit }: Props): ReactElement => {
  const { projectId, name, content, dependencies } = editableTask;
  const projects = useSelector((state: ReduxStoreState) => state.projects);
  const [allDependenciesTaskOptions, eligibleOptions] = useEligibleDependencies(
    taskId,
    projectId,
    dependencies
  ) as readonly [ReduxStoreTask[], ReduxStoreTask[]];

  const projectList = Object.values(projects);

  return (
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
          onEdit({ projectId: value == null ? undefined : value.projectId });
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
        onChange={(event) => onEdit({ name: event.currentTarget.value })}
      />
      <TextField
        className={styles.FormElement}
        label="Content"
        type="text"
        value={content}
        onChange={(event) => onEdit({ content: event.currentTarget.value })}
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
        onChange={(_, values) => onEdit({ dependencies: values.map((task) => task.taskId) })}
        renderInput={(params) => (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <TextField label="Dependencies" type="text" {...params} />
        )}
      />
    </FormGroup>
  );
};
