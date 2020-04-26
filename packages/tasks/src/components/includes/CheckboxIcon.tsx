import CheckBox from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlank from '@material-ui/icons/CheckBoxOutlineBlank';
import IndeterminateCheckBox from '@material-ui/icons/IndeterminateCheckBox';

import { TaskStatus } from '../../models/common-types';

export default (status: TaskStatus): typeof CheckBox => {
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
