import React, { ReactElement } from 'react';

import Card from '@material-ui/core/Card';
import AssessmentIcon from '@material-ui/icons/Assessment';
import { useSelector } from 'react-redux';

import { SanctionedColor } from '../../models/common-types';
import { ProjectId } from '../../models/ids';
import { ReduxStoreState } from '../../models/redux-store-types';
import { getAppUser } from '../../util/authentication';
import { createTask } from '../../util/firestore-actions';
import MaterialColoredCardHeader from '../util/MaterialColoredCardHeader';
import styles from './TaskCard.module.css';
import TaskCardInlineEditor from './TaskCardInlineEditor';

type Props = {
  readonly projectId: ProjectId;
  readonly onDiscard?: () => void;
  readonly onSave: () => void;
};

export default ({ projectId, onDiscard, onSave }: Props): ReactElement => {
  const color = useSelector<ReduxStoreState, SanctionedColor>(
    state => state.projects[projectId].color
  );

  return (
    <Card variant="outlined" className={styles.TaskCard}>
      <MaterialColoredCardHeader
        title="Creating Task"
        color={color}
        avatar={<AssessmentIcon titleAccess="Task" fontSize="large" />}
      />
      <TaskCardInlineEditor
        initialEditableTask={{ name: '', content: '', dependencies: [] }}
        onDiscard={onDiscard ?? onSave}
        onSave={change => {
          onSave();
          createTask({ owner: getAppUser().email, projectId, completed: false, ...change });
        }}
      />
    </Card>
  );
};
