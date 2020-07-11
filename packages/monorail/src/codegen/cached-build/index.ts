/* eslint-disable no-console */

import { spawnSync } from 'child_process';

import cachedBuildTargetDeterminator from './cached-build-target-determinator';

const cachedBuild = async (): Promise<void> => {
  const targets = cachedBuildTargetDeterminator();

  if (targets.length === 0) {
    return;
  }
  console.log('--- Monorail Cached Build Service ---');
  console.group(`[${targets.join(', ')}] needs to be rebuilt!`);

  const successfulStatus = targets.map((workspace) => {
    console.log(`Rebuiding \`${workspace}\`...`);
    return [
      workspace,
      spawnSync('yarn', ['workspace', workspace, 'codegen'], {
        shell: true,
        stdio: 'inherit',
      }).status === 0,
    ] as const;
  });

  console.groupEnd();

  const failedWorkspacesRuns = successfulStatus
    .filter(([, successful]) => !successful)
    .map(([name]) => name);

  if (failedWorkspacesRuns.length === 0) {
    console.log('All workspaces have been successfully rebuilt!');
    return;
  }

  throw new Error(`[${failedWorkspacesRuns.join(', ')}] failed to exit with 0`);
};

export default cachedBuild;
