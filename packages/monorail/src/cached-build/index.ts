/* eslint-disable no-console */

import { spawnSync } from 'child_process';

import chalk from 'chalk';

import cachedBuildTargetDeterminator from './cached-build-target-determinator';

const cachedBuild = async (): Promise<void> => {
  console.log(chalk.blue('--- Monorail Cached Build Service ---'));
  const targets = cachedBuildTargetDeterminator();
  if (targets.length === 0) {
    console.log(chalk.green('[✓] No need to rebuild!'));
    return;
  }

  console.group(chalk.yellow(`[${targets.join(', ')}] needs to be rebuilt!`));
  const successfulStatus = targets.map((workspace) => {
    console.log(`Rebuiding \`${workspace}\`...`);
    return [
      workspace,
      spawnSync('yarn', ['workspace', workspace, 'codegen'], {
        stdio: ['inherit', process.env.INCLUDE_ERROR ? 'inherit' : 'ignore', 'inherit'],
      }).status === 0,
    ] as const;
  });
  console.groupEnd();

  const failedWorkspacesRuns = successfulStatus
    .filter(([, successful]) => !successful)
    .map(([name]) => name);

  if (failedWorkspacesRuns.length === 0) {
    console.log(chalk.green('[✓] All workspaces have been successfully rebuilt!'));
    return;
  }

  throw new Error(`[x] [${failedWorkspacesRuns.join(', ')}] failed to exit with 0`);
};

export default cachedBuild;
