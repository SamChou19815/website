import { spawnSync } from 'child_process';

const checkThatThereIsNoChangedFiles = (): void => {
  const changedFiles = spawnSync('git', ['status', '--porcelain'], {
    shell: true,
  }).stdout.toString();
  if (changedFiles.length === 0) return;
  throw new Error(
    `There are changed files! Generated files might be out-of-sync!\n${changedFiles.trimEnd()}`
  );
};

export default checkThatThereIsNoChangedFiles;
