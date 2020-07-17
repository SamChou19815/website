/* eslint-disable no-console */

import { spawnSync, spawn } from 'child_process';

import workspaceSourcesNeedRebuild from '../infrastructure/need-rebuild-checker';
import {
  getYarnWorkspacesInTopologicalOrder,
  getYarnWorkspaceHasCompileScript,
  getYarnWorkspaceLocation,
} from '../infrastructure/yarn-workspace-dependency-analysis';
import {
  getIncrementalCompileLastRunTime,
  setIncrementalCompileLastRunTime,
} from './incremental-compile-cache';

const incrementalCompile = async (): Promise<void> => {
  console.log('--- Monorail Incremental Compile Service ---');

  const lastRunTime = getIncrementalCompileLastRunTime();

  const needToRecompileLocalCheck = (workspace: string): boolean =>
    workspaceSourcesNeedRebuild(getYarnWorkspaceLocation(workspace), '.', lastRunTime);
  const needToRecompileCICheck = (workspace: string): boolean =>
    spawnSync('git', ['diff', 'HEAD^', 'HEAD', '--name-only', getYarnWorkspaceLocation(workspace)])
      .stdout.toString()
      .trim().length > 0;
  const needToRecompileCheck = process.env.CI ? needToRecompileCICheck : needToRecompileLocalCheck;

  const workspacesToCompile = getYarnWorkspacesInTopologicalOrder()
    .filter(getYarnWorkspaceHasCompileScript)
    .filter(needToRecompileCheck);
  if (workspacesToCompile.length === 0) {
    console.log('[✓] Nothing needs to be recompiled!');
    return;
  }
  console.group(`[${workspacesToCompile.join(', ')}] needs to be re-compiled!`);

  const successfulStatus = await Promise.all(
    workspacesToCompile.map((workspace) => {
      console.log(`Compiling \`${workspace}\`...`);
      const childProcess = spawn('yarn', ['workspace', workspace, 'compile']);
      return new Promise<readonly [string, boolean]>((resolve) => {
        childProcess.on('exit', (code) => resolve([workspace, code === 0] as const));
      });
    })
  );

  console.groupEnd();

  const failedWorkspacesRuns = successfulStatus
    .filter(([, successful]) => !successful)
    .map(([name]) => name);

  if (failedWorkspacesRuns.length === 0) {
    console.log('[✓] All workspaces have been successfully compiled!');
    setIncrementalCompileLastRunTime();
    return;
  }

  throw new Error(`[x] [${failedWorkspacesRuns.join(', ')}] failed to exit with 0`);
};

export default incrementalCompile;
