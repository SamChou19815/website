import React, { ReactElement } from 'react';

import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';

import { SanctionedColor } from '../../models/common-types';
import { sanctionedColors, sanctionedColorMapping } from '../../util/constants';
import { FormProps } from '../util/MaterialFormDialog';
import styles from './ProjectCardEditForm.module.css';

type EditableProject = {
  readonly isPublic: boolean;
  readonly name: string;
  readonly color: SanctionedColor;
};

export default ({
  values: { isPublic, name, color },
  onChange,
}: FormProps<EditableProject>): ReactElement => (
  <FormGroup row={false}>
    <FormControlLabel
      className={styles.FormElement}
      control={
        // eslint-disable-next-line react/jsx-wrap-multilines
        <Switch
          checked={isPublic}
          onChange={(event) => onChange({ isPublic: event.target.checked })}
        />
      }
      label={isPublic ? 'Public' : 'Private'}
      labelPlacement="end"
    />
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
  </FormGroup>
);
