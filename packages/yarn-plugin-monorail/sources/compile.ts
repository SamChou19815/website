/* eslint-disable no-console */

import { spawn, spawnSync } from 'child_process';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';

import {
  redTerminalSection,
  greenTerminalSection,
  yellowTerminalSection,
  blueTerminalSection,
  magentaTerminalSection,
} from './fancy-terminal';

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

const compilingPrinting = (): NodeJS.Timeout => {
  let iteration = 0;
  const startTime = new Date().getTime();
  const spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  return setInterval(
    () => {
      const passedTime = ((new Date().getTime() - startTime) / 1000).toFixed(1);
      const frame = spinner[iteration % 10];
      process.stderr.write(yellowTerminalSection(`[?] Compiling (${passedTime}s) ${frame}\r`));
      iteration += 1;
    },
    process.stderr.isTTY ? 50 : 1000
  );
};

const incrementalCompile = async (): Promise<boolean> => {
  const workspacesJson: YarnWorkspacesJson = readJson('workspaces.json');
  const tasksToRun = workspacesTargetDeterminator(workspacesJson);

  tasksToRun.forEach((workspace) => {
    console.error(blueTerminalSection(`[i] \`${workspace}\` needs to be recompiled.`));
  });

  const compilingMessageInterval = compilingPrinting();
  const statusAndStdErrorListPromises = Promise.all(
    tasksToRun.map((workspace) => {
      const childProcess = spawn('yarn', ['workspace', workspace, 'compile'], {
        shell: true,
        stdio: ['ignore', 'pipe', 'ignore'],
      });
      let collector = '';

      childProcess.stdout.on('data', (chunk) => {
        collector += chunk.toString();
      });
      return new Promise<readonly [string, boolean, string]>((resolve) => {
        childProcess.on('exit', (code) => resolve([workspace, code === 0, collector]));
      });
    })
  );

  const statusAndStdErrorList = await statusAndStdErrorListPromises;
  clearInterval(compilingMessageInterval);

  const globalStdErrorCollector = statusAndStdErrorList.map((it) => it[2]).join('');
  const failedWorkspacesRuns = statusAndStdErrorList.filter((it) => !it[1]).map((it) => it[0]);

  if (failedWorkspacesRuns.length === 0) {
    console.error(greenTerminalSection(`[✓] All workspaces have been successfully compiled!`));
    return true;
  }
  console.error(magentaTerminalSection('[!] Compilation finished with some errors.'));
  console.error(globalStdErrorCollector.trim());
  failedWorkspacesRuns.forEach((workspace) => {
    console.error(redTerminalSection(`[x] \`${workspace}\` failed to exit with 0.`));
  });

  return false;
};

export default incrementalCompile;
