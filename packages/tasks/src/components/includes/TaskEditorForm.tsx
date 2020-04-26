import React, { ReactElement } from 'react';

import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { getAppUser } from 'lib-firebase/authentication';
import MarkdownBlock from 'lib-react/MarkdownBlock';

import { SanctionedColor } from '../../models/common-types';
import { TaskId } from '../../models/ids';
import { ReduxStoreTask } from '../../models/redux-store-types';
import { sanctionedColors, sanctionedColorMapping } from '../../util/constants';
import { createTask, editTask } from '../../util/firestore-actions';
import { useEligibleDependencies } from '../hooks/useTasks';
import styles from './TaskEditorForm.module.css';

export type EditableTask = {
  readonly name: string;
  readonly color: SanctionedColor;
  readonly content: string;
  readonly dependencies: readonly TaskId[];
};

type Props = {
  readonly taskId?: TaskId;
  readonly values: EditableTask;
  readonly onChange: (change: Partial<EditableTask>) => void;
};

export const shouldBeDisabled = ({ name }: EditableTask): boolean => name.trim().length === 0;

export const saveTask = (taskId: TaskId, task: EditableTask): void => {
  editTask({ taskId, ...task });
};

export const createNewTask = (task: EditableTask): void => {
  createTask({ owner: getAppUser().email, status: 'to-do', ...task });
};

export default ({ taskId, values, onChange }: Props): ReactElement => {
  const { name, color, content, dependencies } = values;
  const [allDependenciesTaskOptions, eligibleOptions] = useEligibleDependencies(
    taskId,
    dependencies
  ) as readonly [ReduxStoreTask[], ReduxStoreTask[]];

  return (
    <FormGroup row={false}>
      <div>
        <MarkdownBlock>{`### ${name}\n${content}`}</MarkdownBlock>
        <Divider />
      </div>
      <TextField
        className={styles.FormElement}
        label="Name"
        type="text"
        value={name}
        onChange={(event) => onChange({ name: event.currentTarget.value })}
      />
      <FormControl className={styles.FormElement}>
        <InputLabel>Color</InputLabel>
        <Select
          value={color}
          onChange={(event) => onChange({ color: event.target.value as SanctionedColor })}
        >
          {sanctionedColors.map((sanctionedColor) => (
            <MenuItem
              key={sanctionedColor}
              value={sanctionedColor}
              style={{ color: sanctionedColorMapping[sanctionedColor] }}
            >
              {sanctionedColor}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        className={styles.FormElement}
        label="Content"
        type="text"
        value={content}
        onChange={(event) => onChange({ content: event.currentTarget.value })}
        multiline
      />
      <Autocomplete
        multiple
        className={styles.FormElement}
        options={eligibleOptions}
        autoHighlight
        getOptionLabel={(option) => option.name}
        renderOption={(option) => {
          const backgroundColor = sanctionedColorMapping[option.color];
          return (
            <>
              <span className={styles.ColorDot} style={{ backgroundColor }} />
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
        onChange={(_, dependencyValues) => {
          onChange({ dependencies: dependencyValues.map((task) => task.taskId) });
        }}
        renderInput={(params) => (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <TextField label="Dependencies" type="text" {...params} />
        )}
      />
    </FormGroup>
  );
};
