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
  since: number,
  pathPrefix = '.'
): Promise<ChangedFilesQueryResults> => {
  const events: readonly { type: 'changed' | 'deleted'; filename: string }[] = await fetch(
    `http://localhost:19815/?since=${since}&pathPrefix=${pathPrefix}`
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

const queryChangedFilesSince = async (
  since: number,
  pathPrefix = '.'
): Promise<ChangedFilesQueryResults> => {
  const queryFromGitDiffResult = (base: string, head?: string): ChangedFilesQueryResults =>
    parseGitDiffWithStatus_EXPOSED_FOR_TESTING(
      spawnSync('git', [
        'diff',
        base,
        ...(head ? [head] : []),
        '--name-status',
        '--diff-filter=ADRM',
        '--',
        pathPrefix,
      ]).stdout.toString()
    );

  if (process.env.CI) {
    return queryFromGitDiffResult('HEAD^', 'HEAD');
  }
  try {
    return await queryChangedFilesFromDevSamWatcherServerSince(since, pathPrefix);
  } catch {
    // In case the server is dead, run the git command locally, assuming origin/master is always good.
    return queryFromGitDiffResult('origin/master');
  }
};

export default queryChangedFilesSince;
