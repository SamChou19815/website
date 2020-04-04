import React, { ReactElement } from 'react';

import { RouteComponentProps } from 'react-router';

import { QueueId } from '../models/types';
import { useSingleQueue } from '../util/use-collections';
import ConfiguredMainAppBarrier from './ConfiguredMainAppBarrier';
import LoadingPage from './LoadingPage';
import MaterialThemedApp from './MaterialThemedApp';
import QueueView from './QueueView';

type IdProps = { readonly queueId: QueueId };

export default ({
  match: {
    params: { queueId },
  },
}: RouteComponentProps<IdProps>): ReactElement => {
  const Wrapped = (): ReactElement => {
    const queue = useSingleQueue(queueId);

    if (queue === 'loading') {
      return <LoadingPage />;
    }
    if (queue === 'bad-queue') {
      return (
        <MaterialThemedApp title="Error Queue">
          <div>The queue id is invalid.</div>
        </MaterialThemedApp>
      );
    }
    return (
      <MaterialThemedApp title={queue.name}>
        <QueueView queue={queue} />
      </MaterialThemedApp>
    );
  };
  return <ConfiguredMainAppBarrier appComponent={Wrapped} />;
};
