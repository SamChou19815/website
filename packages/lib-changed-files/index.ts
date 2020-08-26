import { spawnSync } from 'child_process';

import fetch from 'node-fetch';

export type ChangedFilesQueryResults = {
  readonly changedFiles: readonly string[];
  readonly deletedFiles: readonly string[];
};

export const parseGitDiffWithStatus_EXPOSED_FOR_TESTING = (
  diffString: string
): ChangedFilesQueryResults => {
  const changedFiles: string[] = [];
  const deletedFiles: string[] = [];

  diffString
    .trim()
    .split('\n')
    .forEach((line) => {
      const parts = line.trim().split(/\s/);
      const type = parts[0];
      if (type === 'A' || type === 'M') {
        changedFiles.push(parts[1]);
      } else if (type === 'D') {
        deletedFiles.push(parts[1]);
      } else if (type.startsWith('R')) {
        deletedFiles.push(parts[1]);
        changedFiles.push(parts[2]);
      }
    });

  return { changedFiles, deletedFiles };
};

const queryChangedFilesFromDevSamWatcherServerSince = async (
  since: number
): Promise<ChangedFilesQueryResults> => {
  const events: readonly { type: 'changed' | 'deleted'; filename: string }[] = await fetch(
    `http://localhost:19815/?since=${since}`
  ).then((response) => response.json());
  const changedFiles: string[] = [];
  const deletedFiles: string[] = [];

  events.forEach(({ type, filename }) => {
    if (type === 'changed') {
      changedFiles.push(filename);
    } else {
      deletedFiles.push(filename);
    }
  });

  return { changedFiles, deletedFiles };
};

const queryChangedFilesSince = async (since: number): Promise<ChangedFilesQueryResults> => {
  if (process.env.CI) {
    return parseGitDiffWithStatus_EXPOSED_FOR_TESTING(
      spawnSync('git', [
        'diff',
        'HEAD^',
        'HEAD',
        '--name-status',
        '--diff-filter=ADRM',
      ]).stdout.toString()
    );
  }
  try {
    return await queryChangedFilesFromDevSamWatcherServerSince(since);
  } catch {
    // In case the server is dead, run the git command locally, assuming origin/master is always good.
    return parseGitDiffWithStatus_EXPOSED_FOR_TESTING(
      spawnSync('git', [
        'diff',
        'origin/master',
        'HEAD',
        '--name-status',
        '--diff-filter=ADRM',
      ]).stdout.toString()
    );
  }
};

export default queryChangedFilesSince;
