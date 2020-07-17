/* eslint-disable no-console */

import { spawnSync } from 'child_process';

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

const incrementalCompile = (): void => {
  console.log('--- Monorail Incremental Compile Service ---');

  const lastRunTime = getIncrementalCompileLastRunTime();

  const needToRecompileLocalCheck = (workspace: string): boolean =>
    workspaceSourcesNeedRebuild(getYarnWorkspaceLocation(workspace), '.', lastRunTime);

  const workspacesToCompile = getYarnWorkspacesInTopologicalOrder()
    .filter(getYarnWorkspaceHasCompileScript)
    .filter(needToRecompileLocalCheck);
  if (workspacesToCompile.length === 0) {
    console.log('[✓] Nothing needs to be recompiled!');
    return;
  }
  console.group(`[${workspacesToCompile.join(', ')}] needs to be re-compiled!`);

  const successfulStatus = workspacesToCompile.map((workspace) => {
    console.log(`Compiling \`${workspace}\`...`);
    return [
      workspace,
      spawnSync('yarn', ['workspace', workspace, 'compile'], {
        stdio: ['inherit', process.env.INCLUDE_ERROR ? 'inherit' : 'ignore', 'inherit'],
      }).status === 0,
    ] as const;
  });

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
