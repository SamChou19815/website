import React, { ReactElement, useState } from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { ReduxStoreState } from '../models/types';
import { queuesCollection } from '../util/firestore';
import { createNewQueue } from '../util/firestore-actions';
import ConfiguredMainAppBarrier from './ConfiguredMainAppBarrier';
import MaterialThemedApp from './MaterialThemedApp';

const Home = (): ReactElement => {
  const queues = useSelector((state: ReduxStoreState) => state.queues);
  const history = useHistory();
  const [newQueueName, setNewQueueName] = useState<string | null>(null);

  return (
    <div className="card-container">
      {true && (
        <>
          <Typography component="h2" variant="h4" className="centered-title">
            Owned Queues
          </Typography>
          {queues.length === 0 && <div>No owned queues yet.</div>}
          {queues.map((queue) => (
            <Card key={queue.queueId} variant="outlined" className="common-card">
              <CardHeader title={queue.name} />
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => history.push(`/queue/${queue.queueId}`)}
                >
                  Manage
                </Button>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => queuesCollection.doc(queue.queueId).delete()}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          ))}
        </>
      )}
      {newQueueName !== null && (
        <Card variant="outlined" className="common-card">
          <CardHeader title="Queue Creator" />
          <CardContent>
            <TextField
              label="Queue name"
              type="text"
              className="text-input"
              value={newQueueName}
              onChange={(event) => setNewQueueName(event.currentTarget.value)}
            />
          </CardContent>
          <CardActions>
            <Button size="small" color="primary" onClick={() => setNewQueueName(null)}>
              Discard
            </Button>
            <Button
              size="small"
              color="primary"
              disabled={newQueueName?.trim().length === 0 ?? true}
              onClick={() => {
                if (newQueueName === null) {
                  throw new Error();
                }
                createNewQueue(newQueueName);
                setNewQueueName(null);
              }}
            >
              Submit
            </Button>
          </CardActions>
        </Card>
      )}
      {newQueueName === null && (
        <Button
          variant="outlined"
          color="primary"
          className="centered-button"
          onClick={() => setNewQueueName('')}
          disableElevation
        >
          Create new queue
        </Button>
      )}
    </div>
  );
};

const Wrapped = (): ReactElement => (
  <MaterialThemedApp title="Queue">
    <Home />
  </MaterialThemedApp>
);

export default (): ReactElement => <ConfiguredMainAppBarrier appComponent={Wrapped} />;
