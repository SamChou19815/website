import React, { ReactElement, useState } from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { useSelector } from 'react-redux';

import { ReduxStoreState } from '../models/types';
import { createNewQueue } from '../util/firestore-actions';
import ConfiguredMainAppBarrier from './ConfiguredMainAppBarrier';
import MaterialThemedApp from './MaterialThemedApp';
import QueueCard from './QueueCard';

const Home = (): ReactElement => {
  const queues = useSelector((state: ReduxStoreState) => state.queues);
  const [newQueueName, setNewQueueName] = useState('');

  return (
    <div className="card-container">
      {true && (
        <>
          <Typography component="h2" variant="h4" className="centered-title">
            Owned Queues
          </Typography>
          {queues.length === 0 && <div>No owned queues yet.</div>}
          {queues.map((queue) => (
            <QueueCard key={queue.queueId} queue={queue} />
          ))}
        </>
      )}
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
          <Button size="small" color="primary" onClick={() => setNewQueueName('')}>
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
              setNewQueueName('');
            }}
          >
            Submit
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

const Wrapped = (): ReactElement => (
  <MaterialThemedApp title="Home">
    <Home />
  </MaterialThemedApp>
);

export default (): ReactElement => <ConfiguredMainAppBarrier appComponent={Wrapped} />;
