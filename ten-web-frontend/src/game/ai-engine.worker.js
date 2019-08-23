import selectMove from './mcts';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const doWork = ({ data }) =>
  postMessage({
    aiResponse: selectMove(data),
    board: data
  });

// eslint-disable-next-line no-restricted-globals
self.addEventListener('message', doWork);
