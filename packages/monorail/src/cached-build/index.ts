/* eslint-disable no-console */

import { spawnSync } from 'child_process';

import cachedBuildTargetDeterminator from './cached-build-target-determinator';

const cachedBuild = async (): Promise<void> => {
  console.log('--- Monorail Cached Build Service ---');
  const targets = cachedBuildTargetDeterminator();
  if (targets.length === 0) {
    console.log('[✓] No need to rebuild!');
    return;
  }

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
    console.log('\n[✓] All workspaces have been successfully rebuilt!');
    return;
  }

  throw new Error(`[x] [${failedWorkspacesRuns.join(', ')}] failed to exit with 0`);
};

export default cachedBuild;
