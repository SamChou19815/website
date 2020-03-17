import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import AssessmentIcon from '@material-ui/icons/Assessment';
import MarkdownBlock from 'lib-react/MarkdownBlock';
import MaterialAlertDialog from '../util/MaterialAlertDialog';
import MaterialColoredCardHeader from '../util/MaterialColoredCardHeader';
import { SanctionedColor } from '../../models/common-types';
import { ReduxStoreTask, ReduxStoreState } from '../../models/redux-store-types';
import styles from './TaskCard.module.css';

type Props = { readonly task: ReduxStoreTask };

export default ({
  task: { taskId, projectId, name, content, dependencies, completed }
}: Props): ReactElement => {
  const color = useSelector<ReduxStoreState, SanctionedColor>(
    state => state.projects[projectId].color
  );

  return (
    <Card variant="outlined" className={styles.TaskCard}>
      <MaterialColoredCardHeader
        title={name}
        color={color}
        avatar={<AssessmentIcon titleAccess="Task" fontSize="large" />}
      />
      <CardContent>
        <MarkdownBlock>{content}</MarkdownBlock>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary">
          {completed ? 'Uncomplete' : 'Complete'}
        </Button>
        <Button size="small" color="primary">
          Edit
        </Button>
        <MaterialAlertDialog
          alertTitle="Deleting a task?"
          alertDescription="Once deleted, the task cannot be recovered."
          // eslint-disable-next-line no-console
          onConfirm={() => console.log(`Delete Task ${taskId}`)}
        >
          {trigger => (
            <Button
              size="small"
              color="primary"
              disabled={dependencies.length > 0}
              onClick={trigger}
            >
              Delete
            </Button>
          )}
        </MaterialAlertDialog>
      </CardActions>
    </Card>
  );
};
