import { spawnSync } from 'child_process';

import { assertNotNull } from 'lib-common';

export type ChangedFilesQueryResults = {
  readonly changedFiles: readonly string[];
  readonly deletedFiles: readonly string[];
};

export const parseGitDiffWithStatus_EXPOSED_FOR_TESTING = (
  diffString: string
): ChangedFilesQueryResults => {
  const changedFiles: string[] = [];
  const deletedFiles: string[] = [];

  diffString
    .trim()
    .split('\n')
    .forEach((line) => {
      const parts = line
        .trim()
        .split(/\s/)
        .filter((it) => it.trim().length > 0);
      if (parts.length === 0) {
        return;
      }
      const [type, part1, part2] = parts;
      assertNotNull(type);
      assertNotNull(part1);
      if (type === 'A' || type === 'M') {
        changedFiles.push(part1);
      } else if (type === 'D') {
        deletedFiles.push(part1);
      } else if (type.startsWith('R')) {
        deletedFiles.push(part1);
        assertNotNull(part2);
        changedFiles.push(part2);
      }
    });

  return { changedFiles, deletedFiles };
};

const queryChangedFilesSince = (pathPrefix = '.'): ChangedFilesQueryResults => {
  const queryFromGitDiffResult = (base: string, head?: string): ChangedFilesQueryResults => {
    const gitDiffResponse = spawnSync('git', [
      'diff',
      base,
      ...(head ? [head] : []),
      '--name-status',
      '--diff-filter=ADRM',
      '--',
      pathPrefix,
    ]).stdout.toString();
    return parseGitDiffWithStatus_EXPOSED_FOR_TESTING(gitDiffResponse);
  };

  if (process.env.CI) {
    return queryFromGitDiffResult('HEAD^', 'HEAD');
  }
  return queryFromGitDiffResult('origin/master');
};

export default queryChangedFilesSince;
