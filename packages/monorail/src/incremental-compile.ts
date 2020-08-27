/* eslint-disable no-console */

import { spawn } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

import { YarnWorkspacesJson } from '@dev-sam/yarn-workspaces-json-types';

import queryChangedFilesSince from 'lib-changed-files';
import runIncrementalTasks from 'lib-incremental';

const incrementalCompile = async (): Promise<void> => {
  const workspacesJson: YarnWorkspacesJson = JSON.parse(readFileSync('workspaces.json').toString());

  const failedWorkspacesRuns = await runIncrementalTasks({
    lastestKnownGoodRunTimeFilename: join('.monorail', 'compile-cache.json'),

    needRerun: async (latestKnownGoodRerunTime) => {
      const allWorkspaces = await Promise.all(
        workspacesJson.topologicallyOrdered.map(async (workspaceName) => {
          const needRebuilds = await Promise.all(
            workspacesJson.information[workspaceName].dependencyChain.map(async (item) => {
              const { changedFiles, deletedFiles } = await queryChangedFilesSince(
                latestKnownGoodRerunTime[item] ?? 0,
                workspacesJson.information[item].workspaceLocation
              );
              return changedFiles.length + deletedFiles.length !== 0;
            })
          );
          return [workspaceName, needRebuilds.some((it) => it)] as const;
        })
      );

      const targets = allWorkspaces
        .filter(([, needRebuild]) => needRebuild)
        .map(([workspace]) => workspace);
      if (targets.length !== 0) {
        console.log(`[${targets.join(', ')}] needs to be re-compiled!`);
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
  });

  if (failedWorkspacesRuns.length === 0) {
    console.log('[✓] All workspaces have been successfully compiled!');
    return;
  }
  throw new Error(`[x] [${failedWorkspacesRuns.join(', ')}] failed to exit with 0`);
};

export default incrementalCompile;
