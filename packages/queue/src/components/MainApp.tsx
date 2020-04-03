import React, { ReactElement, useState } from 'react';

import { AppQueue } from '../models/types';
import { createNewQueue } from '../util/firestore-actions';
import { useQueues } from '../util/use-collections';
import LoadingPage from './LoadingPage';
import QueueView from './QueueView';

export default (): ReactElement => {
  const queues = useQueues();
  const [newQueueName, setNewQueueName] = useState<string | null>(null);
  const [currentQueue, setCurrentQueue] = useState<AppQueue | null>(null);

  if (queues === null) {
    return <LoadingPage />;
  }

  return (
    <div>
      {currentQueue === null && (
        <div>
          <h2>Queues you own:</h2>
          {queues.map((queue) => (
            <div key={queue.queueId}>
              <div>{queue.name}</div>
              <button type="button" onClick={() => setCurrentQueue(queue)}>
                Manage
              </button>
            </div>
          ))}
        </div>
      )}
      {currentQueue === null && newQueueName !== null && (
        <div>
          <h2>Queue Creator</h2>
          <div>
            <input
              type="text"
              placeholder="Queue name"
              value={newQueueName}
              onChange={(event) => setNewQueueName(event.currentTarget.value)}
            />
          </div>
          <button
            type="button"
            onClick={() => {
              if (newQueueName === null) {
                throw new Error();
              }
              createNewQueue(newQueueName);
              setNewQueueName(null);
            }}
          >
            Submit
          </button>
        </div>
      )}
      {currentQueue === null && newQueueName === null && (
        <button type="button" onClick={() => setNewQueueName('')}>
          Create new queue
        </button>
      )}
      {currentQueue !== null && (
        <button type="button" onClick={() => setCurrentQueue(null)}>
          Back to queues
        </button>
      )}
      {currentQueue !== null && <QueueView queue={currentQueue} />}
    </div>
  );
};
