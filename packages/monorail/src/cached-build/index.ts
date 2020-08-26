/* eslint-disable no-console */

import { spawnSync } from 'child_process';
import { join } from 'path';

import chalk from 'chalk';

import { workspaceInformation } from '../infrastructure/yarn-workspace-dependency-analysis';

import queryChangedFilesSince from 'lib-changed-files';
import runIncrementalTasks, { IncrementalTaskSpecification } from 'lib-incremental';

const incrementalTaskSpecification: IncrementalTaskSpecification = {
  lastestKnownGoodRunTimeFilename: join('.monorail', 'build-cache.json'),
  needRerun: async (latestKnownGoodRerunTime) => {
    const allWorkspaces = await Promise.all(
      Array.from(workspaceInformation.entries()).map(
        async ([workspaceName, { workspaceLocation, codegenOutput }]) => {
          if (codegenOutput == null) return [workspaceName, false] as const;
          const { changedFiles, deletedFiles } = await queryChangedFilesSince(
            latestKnownGoodRerunTime[workspaceName] ?? 0,
            workspaceLocation
          );
          const outputPathToExclude = join(workspaceLocation, codegenOutput);
          const meaningfulFiles = [...changedFiles, ...deletedFiles].filter(
            (it) => it !== outputPathToExclude
          );
          return [workspaceName, meaningfulFiles.length !== 0] as const;
        }
      )
    );

    const targets = allWorkspaces
      .filter(([, needRebuild]) => needRebuild)
      .map(([workspace]) => workspace);
    if (targets.length !== 0) {
      console.log(chalk.yellow(`[${targets.join(', ')}] needs to be rebuilt!`));
    }
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
