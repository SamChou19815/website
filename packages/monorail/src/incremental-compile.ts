/* eslint-disable no-console */

import { spawn } from 'child_process';
import { join } from 'path';

import chalk from 'chalk';

import { workspaceInformation } from './yarn-workspaces';

import queryChangedFilesSince from 'lib-changed-files';
import runIncrementalTasks, { IncrementalTaskSpecification } from 'lib-incremental';

const incrementalTaskSpecification: IncrementalTaskSpecification = {
  lastestKnownGoodRunTimeFilename: join('.monorail', 'compile-cache.json'),
  needRerun: async (latestKnownGoodRerunTime) => {
    const allWorkspaces = await Promise.all(
      Array.from(workspaceInformation.entries()).map(
        async ([workspaceName, { workspaceLocation }]) => {
          const { changedFiles, deletedFiles } = await queryChangedFilesSince(
            latestKnownGoodRerunTime[workspaceName] ?? 0,
            workspaceLocation
          );
          return [workspaceName, changedFiles.length + deletedFiles.length !== 0] as const;
        }
      )
    );

    const targets = allWorkspaces
      .filter(([, needRebuild]) => needRebuild)
      .map(([workspace]) => workspace);
    if (targets.length !== 0) {
      console.log(chalk.yellow(`[${targets.join(', ')}] needs to be re-compiled!`));
    }
    return targets;
  },
  rerun: async (workspace) => {
    console.log(`Compiling \`${workspace}\`...`);
    const childProcess = spawn('yarn', ['workspace', workspace, 'compile']);
    return await new Promise<boolean>((resolve) => {
      childProcess.on('exit', (code) => resolve(code === 0));
    });
  },
};

const incrementalCompile = async (): Promise<void> => {
  console.log(chalk.blue('--- Monorail Incremental Compile Service ---'));
  const failedWorkspacesRuns = await runIncrementalTasks(incrementalTaskSpecification);
  if (failedWorkspacesRuns.length === 0) {
    console.log(chalk.green('[✓] All workspaces have been successfully compiled!'));
    return;
  }
  throw new Error(`[x] [${failedWorkspacesRuns.join(', ')}] failed to exit with 0`);
};

export default incrementalCompile;
