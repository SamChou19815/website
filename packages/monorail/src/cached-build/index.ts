/* eslint-disable no-console */

import { spawnSync } from 'child_process';
import { join } from 'path';

import chalk from 'chalk';

import cachedBuildTargetDeterminator from './cached-build-target-determinator';

import runIncrementalTasks, { IncrementalTaskSpecification } from 'lib-incremental';

const incrementalTaskSpecification: IncrementalTaskSpecification = {
  lastestKnownGoodRunTimeFilename: join('.monorail', 'build-cache.json'),
  needRerun: async () => {
    const targets = cachedBuildTargetDeterminator();
    if (targets.length === 0) {
      console.log(chalk.green('[✓] No need to rebuild!'));
      return [];
    }
    console.log(chalk.yellow(`[${targets.join(', ')}] needs to be rebuilt!`));
    return targets;
  },
  rerun: async (workspace) => {
    console.log(`Rebuiding \`${workspace}\`...`);
    return (
      spawnSync('yarn', ['workspace', workspace, 'codegen'], {
        stdio: ['inherit', process.env.INCLUDE_ERROR ? 'inherit' : 'ignore', 'inherit'],
      }).status === 0
    );
  },
};

const cachedBuild = async (): Promise<void> => {
  console.log(chalk.blue('--- Monorail Cached Build Service ---'));
  const failedWorkspacesRuns = await runIncrementalTasks(incrementalTaskSpecification);
  if (failedWorkspacesRuns.length === 0) {
    console.log(chalk.green('[✓] All workspaces have been successfully rebuilt!'));
    return;
  }
  throw new Error(`[x] [${failedWorkspacesRuns.join(', ')}] failed to exit with 0`);
};

export default cachedBuild;
