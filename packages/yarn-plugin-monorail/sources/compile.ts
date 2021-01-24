/* eslint-disable no-console */

import { spawn, spawnSync } from 'child_process';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';

const queryChangedFilesSince = (pathPrefix: string): readonly string[] => {
  const queryFromGitDiffResult = (base: string, head?: string) => {
    const trimmed = spawnSync('git', [
      'diff',
      base,
      ...(head ? [head] : []),
      '--name-only',
      '--',
      pathPrefix,
    ])
      .stdout.toString()
      .trim();

    return trimmed === '' ? [] : trimmed.split('\n');
  };

  if (process.env.CI) {
    return queryFromGitDiffResult('HEAD^', 'HEAD');
  }
  return queryFromGitDiffResult('origin/main');
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const readJson = (path: string): any => JSON.parse(readFileSync(path).toString());

const workspaceHasChangedFilesExcludingBundledBinaries = (
  workspacesJson: YarnWorkspacesJson,
  workspaceName: string
): boolean => {
  const isNotBundledBinary = (filename: string): boolean =>
    dirname(filename) !==
    join(workspacesJson.information[workspaceName]?.workspaceLocation ?? '.', 'bin');

  const dependencyChain = workspacesJson.information[workspaceName]?.dependencyChain ?? [];
  return dependencyChain.some((item) => {
    const dependencyWorkspaceName = workspacesJson.information[item]?.workspaceLocation ?? '.';
    const changedFiles = queryChangedFilesSince(dependencyWorkspaceName);
    return changedFiles.some(isNotBundledBinary);
  });
};

const workspacesTargetDeterminator = (workspacesJson: YarnWorkspacesJson): readonly string[] => {
  return workspacesJson.topologicallyOrdered
    .map((workspaceName) => {
      const needRebuild = workspaceHasChangedFilesExcludingBundledBinaries(
        workspacesJson,
        workspaceName
      );
      return [workspaceName, needRebuild] as const;
    })
    .filter(([, needRebuild]) => needRebuild)
    .map(([workspace]) => workspace);
};

interface IncrementalTaskSpecification {
  /**
   * @returns a list of task ID that needs to be rerun.
   * Usually, implementation of this function will consider the set of changed files.
   */
  readonly needRerun: () => readonly string[];
  /** Run the job and returns whether a run is successful. */
  readonly rerun: (taskID: string) => Promise<boolean>;
}

/**
 * The incremental task running framework.
 * It doesn't care about which tasks to rerun and how to rerun them. These information is provided by
 * the `specification` object.
 * Instead, it will maintain latest known good run time to help decide rerunning jobs.
 *
 * @param specification
 * @returns task IDs of failed jobs.
 */
const runIncrementalTasks = async (
  specification: IncrementalTaskSpecification
): Promise<readonly string[]> => {
  const tasksToRun = specification.needRerun();
  const statusList = await Promise.all(
    tasksToRun.map(async (taskID) => [taskID, await specification.rerun(taskID)] as const)
  );

  const failed: string[] = [];
  statusList.forEach(([taskID, successful]) => {
    if (!successful) {
      failed.push(taskID);
    }
  });

  return failed;
};

const incrementalCompile = async (): Promise<boolean> => {
  const workspacesJson: YarnWorkspacesJson = readJson('workspaces.json');

  const failedWorkspacesRuns = await runIncrementalTasks({
    needRerun: () => {
      const targets = workspacesTargetDeterminator(workspacesJson);

      if (targets.length !== 0) {
        console.log(`[${targets.join(', ')}] needs to be compiled!`);
      }
      return targets;
    },

    rerun: async (workspace) => {
      console.log(`Running \`yarn workspace ${workspace} compile\`...`);
      const childProcess = spawn('yarn', ['workspace', workspace, 'compile'], {
        shell: true,
        stdio: 'inherit',
      });
      return await new Promise<boolean>((resolve) => {
        childProcess.on('exit', (code) => resolve(code === 0));
      });
    },
  });

  if (failedWorkspacesRuns.length === 0) {
    console.log(`[✓] All workspaces have been successfully compiled!`);
    return true;
  }
  console.error(`[x] [${failedWorkspacesRuns.join(', ')}] failed to exit with 0`);
  return false;
};

export default incrementalCompile;
