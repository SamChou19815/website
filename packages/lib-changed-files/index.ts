import fetch from 'node-fetch';

export type FilesystemChangeEvent = {
  readonly time: number;
  readonly filename: string;
  readonly type: 'changed' | 'deleted';
};

const queryChangedFilesFromDevSamWatcherServerSince = (
  since: number
): Promise<readonly FilesystemChangeEvent[]> =>
  fetch(`http://localhost:19815/?since=${since}`).then((response) => response.json());

export default queryChangedFilesFromDevSamWatcherServerSince;
