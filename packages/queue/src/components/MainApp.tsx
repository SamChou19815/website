import React, { ReactElement, useState } from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { useSelector } from 'react-redux';

import { AppQueue, ReduxStoreState } from '../models/types';
import { queuesCollection } from '../util/firestore';
import { createNewQueue } from '../util/firestore-actions';
import LoadingPage from './LoadingPage';
import QueueView from './QueueView';

export default (): ReactElement => {
  const queues = useSelector((state: ReduxStoreState) => state.queues);
  const [newQueueName, setNewQueueName] = useState<string | null>(null);
  const [currentQueue, setCurrentQueue] = useState<AppQueue | null>(null);

  if (queues === null) {
    return <LoadingPage />;
  }

  return (
    <div className="card-container">
      {currentQueue === null && (
        <>
          <Typography component="h2" variant="h4" className="centered-title">
            Owned Queues
          </Typography>
          {queues.length === 0 && <div>No owned queues yet.</div>}
          {queues.map((queue) => (
            <Card key={queue.queueId} variant="outlined" className="common-card">
              <CardHeader title={queue.name} />
              <CardActions>
                <Button size="small" color="primary" onClick={() => setCurrentQueue(queue)}>
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
      {currentQueue === null && newQueueName !== null && (
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
      {currentQueue === null && newQueueName === null && (
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
      {currentQueue !== null && (
        <Button
          variant="outlined"
          color="primary"
          className="centered-button"
          onClick={() => setCurrentQueue(null)}
          disableElevation
        >
          Back to queues
        </Button>
      )}
      {currentQueue !== null && <QueueView queue={currentQueue} />}
    </div>
  );
};
