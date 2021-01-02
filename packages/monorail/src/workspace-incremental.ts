/* eslint-disable no-console */

import { spawn } from 'child_process';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';

import type { YarnWorkspacesJson } from '@dev-sam/yarn-workspaces-json-types';

import queryChangedFilesSince from 'lib-changed-files';
import runIncrementalTasks from 'lib-incremental';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const readJson = (path: string): any => JSON.parse(readFileSync(path).toString());

const workspaceHasChangedFilesExcludingBundledBinaries = async (
  workspacesJson: YarnWorkspacesJson,
  workspaceName: string
): Promise<boolean> => {
  const isNotBundledBinary = (filename: string): boolean =>
    dirname(filename) !==
    join(workspacesJson.information[workspaceName]?.workspaceLocation ?? '.', 'bin');

  const files = (workspacesJson.information[workspaceName]?.dependencyChain ?? []).map((item) => {
    const { changedFiles, deletedFiles } = queryChangedFilesSince(
      workspacesJson.information[item]?.workspaceLocation ?? '.'
    );
    return changedFiles.some(isNotBundledBinary) || deletedFiles.some(isNotBundledBinary);
  });
  return files.some((it) => it);
};

const workspacesTargetDeterminator = async (
  workspacesJson: YarnWorkspacesJson,
  needUnconditionalRerun: (json: YarnWorkspacesJson, workspaceName: string) => boolean,
  prereqChecker: (json: YarnWorkspacesJson, workspaceName: string) => boolean
): Promise<readonly string[]> => {
  const allWorkspaces = await Promise.all(
    workspacesJson.topologicallyOrdered.map(async (workspaceName) => {
      if (!prereqChecker(workspacesJson, workspaceName)) {
        return [workspaceName, false] as const;
      }
      if (needUnconditionalRerun(workspacesJson, workspaceName)) {
        return [workspaceName, true] as const;
      }
      const needRebuild = await workspaceHasChangedFilesExcludingBundledBinaries(
        workspacesJson,
        workspaceName
      );
      return [workspaceName, needRebuild] as const;
    })
  );

  return allWorkspaces.filter(([, needRebuild]) => needRebuild).map(([workspace]) => workspace);
};

const runIncrementalWorkspacesTasks = async (
  command: string,
  needUnconditionalRerun: (workspacesJson: YarnWorkspacesJson, workspaceName: string) => boolean,
  prereqChecker: (workspacesJson: YarnWorkspacesJson, workspaceName: string) => boolean
): Promise<void> => {
  const workspacesJson: YarnWorkspacesJson = readJson('workspaces.json');

  const failedWorkspacesRuns = await runIncrementalTasks({
    lastestKnownGoodRunTimeFilename: join('.monorail', `${command}-cache.json`),

    needRerun: async () => {
      const targets = await workspacesTargetDeterminator(
        workspacesJson,
        needUnconditionalRerun,
        prereqChecker
      );

      if (targets.length !== 0) {
        console.log(`[${targets.join(', ')}] needs to be ${command}d!`);
      }
      return targets;
    },

    rerun: async (workspace) => {
      console.log(`Running \`yarn workspace ${workspace} ${command}\`...`);
      const childProcess = spawn('yarn', ['workspace', workspace, command]);
      return await new Promise<boolean>((resolve) => {
        childProcess.on('exit', (code) => resolve(code === 0));
      });
    },
  });

  if (failedWorkspacesRuns.length === 0) {
    console.log(`[✓] All workspaces have been successfully ${command}d!`);
    return;
  }
  throw new Error(`[x] [${failedWorkspacesRuns.join(', ')}] failed to exit with 0`);
};

const incrementalCompile = async (): Promise<void> =>
  runIncrementalWorkspacesTasks(
    'compile',
    () => false,
    () => true
  );

export default incrementalCompile;
