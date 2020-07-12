/* eslint-disable no-console */

import { spawnSync } from 'child_process';
import { existsSync, copyFileSync, mkdirSync, readFileSync } from 'fs';
import { dirname, join, resolve } from 'path';

const safeCopy = (source: string, destination: string): void => {
  mkdirSync(dirname(destination), { recursive: true });
  copyFileSync(source, destination);
};

type SynchronizeFileMappings = Readonly<Record<string, string>>;
type SynchronizeConfiguration = Readonly<Record<string, SynchronizeFileMappings>>;

const synchronizeToRepository = (
  repositoryName: string,
  synchronizeFileMappings: SynchronizeFileMappings
): void => {
  Object.entries(synchronizeFileMappings).forEach(([source, destination]) => {
    safeCopy(source, join('..', repositoryName, destination));
  });
  console.log(`[✓] Synced files to target repository \`${repositoryName}\`.`);

  const repositoryPath = resolve(join('..', repositoryName));
  const spawnOption = {
    cwd: repositoryPath,
    shell: true,
    stdio: 'inherit',
  } as const;

  if (
    spawnSync('git', ['status', '--porcelain'], { cwd: repositoryPath })
      .stdout.toString()
      .trim() === ''
  ) {
    console.log(`[✓] Target repository \`${repositoryName}\` is already in a clean state. Skip.`);
    return;
  }

  console.log(`[✓] Making a pull request for synchronized files in \`${repositoryName}\`.`);
  spawnSync(
    'git',
    ['checkout', '-b', `monorail/sync-service/t-${new Date().getTime()}`],
    spawnOption
  );
  const filesToAdd = Object.values(synchronizeFileMappings);
  spawnSync('git', ['add', ...filesToAdd], spawnOption);
  spawnSync('git', ['commit', '-m', '"[monorail-sync] Automatic file sync commit"'], spawnOption);
  spawnSync('gh', ['pr', 'create', '--fill'], spawnOption);
  console.log(`\n[✓] Made a pull request for synchronized files in \`${repositoryName}\`.`);
};

const synchronize = (): void => {
  const synchronizeConfigurationPath = join('configuration', 'sync-configuration.json');
  if (!existsSync(synchronizeConfigurationPath)) {
    return;
  }
  const synchronizeConfiguration: SynchronizeConfiguration = JSON.parse(
    readFileSync(synchronizeConfigurationPath).toString()
  );

  Object.entries(synchronizeConfiguration).forEach(([repositoryName, synchronizeFileMappings]) => {
    console.group(`Synchronizing for \`${repositoryName}\`...`);
    synchronizeToRepository(repositoryName, synchronizeFileMappings);
    console.groupEnd();
  });
};

export default synchronize;
