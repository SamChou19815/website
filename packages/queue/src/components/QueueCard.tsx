import React, { ReactElement } from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Queue from '@material-ui/icons/Queue';
import { useHistory } from 'react-router';

import { AppQueue } from '../models/types';
import { editQueue, deleteQueue } from '../util/firestore-actions';

export default ({ queue }: { readonly queue: AppQueue }): ReactElement => {
  const history = useHistory();

  const onManage = (): void => history.push(`/queue/${queue.queueId}`);

  const onEdit = (): void => {
    // eslint-disable-next-line no-alert
    const name = prompt('New Name', queue.name);
    if (name == null || name.trim().length === 0) {
      return;
    }
    editQueue(queue.queueId, { name });
  };

  const onDelete = (): void => deleteQueue(queue.queueId);

  return (
    <Card variant="outlined" className="common-card">
      <CardHeader
        avatar={<Queue titleAccess="Queue" fontSize="large" />}
        classes={{ root: 'queue-card-background', title: 'common-card-header-text' }}
        titleTypographyProps={{ variant: 'h6' }}
        title={queue.name}
      />
      <CardActions>
        <Button size="small" color="primary" onClick={onManage}>
          Manage
        </Button>
        <Button size="small" color="primary" onClick={onEdit}>
          Edit
        </Button>
        <Button size="small" color="primary" onClick={onDelete}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};
