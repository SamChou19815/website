import Archive from '@material-ui/icons/Archive';
import Build from '@material-ui/icons/Build';
import CheckBox from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlank from '@material-ui/icons/CheckBoxOutlineBlank';

import { TaskStatus } from '../../models/common-types';

const CheckboxIcon = (status: TaskStatus): typeof CheckBox => {
  switch (status) {
    case 'backlogged':
      return Archive;
    case 'to-do':
      return CheckBoxOutlineBlank;
    case 'in-progress':
      return Build;
    case 'done':
      return CheckBox;
    default:
      throw new Error(status);
  }
};

export default CheckboxIcon;
