import React, { ReactElement } from 'react';

import CheckBox from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlank from '@material-ui/icons/CheckBoxOutlineBlank';
import IndeterminateCheckBox from '@material-ui/icons/IndeterminateCheckBox';

import { TaskStatus } from '../../models/common-types';
import styles from './CheckboxIcon.module.css';

export const getComponent = (status: TaskStatus): typeof CheckBox => {
  switch (status) {
    case 'to-do':
      return CheckBoxOutlineBlank;
    case 'in-progress':
      return IndeterminateCheckBox;
    case 'done':
      return CheckBox;
    default:
      throw new Error();
  }
};

type Props = { readonly status: TaskStatus; readonly onClick: () => void };

export default ({ status, onClick }: Props): ReactElement => {
  const Component = getComponent(status);
  return (
    <Component className={styles.Checkbox} onClick={onClick} titleAccess="Task" fontSize="large" />
  );
};
