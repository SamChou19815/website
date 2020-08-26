/* eslint-disable no-console */

import { spawnSync } from 'child_process';
import { existsSync, copyFileSync, mkdirSync, readFileSync } from 'fs';
import { basename, dirname, join, resolve } from 'path';

import chalk from 'chalk';

const safeCopy = (source: string, destination: string): void => {
  mkdirSync(dirname(destination), { recursive: true });
  copyFileSync(source, destination);
};

const normalizedCommandForPrint = (command: readonly string[]): string =>
  command.map((part) => (part.includes(' ') ? `"${part}"` : part)).join(' ');

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

  if (
    spawnSync('git', ['status', '--porcelain'], { cwd: repositoryPath })
      .stdout.toString()
      .trim() === ''
  ) {
    console.log(`[✓] Target repository \`${repositoryName}\` is already in a clean state. Skip.`);
    return;
  }

  const filesToAdd = Object.values(synchronizeFileMappings);
  const commands = [
    ['git', 'checkout', '-b', `monorail/sync-service/t-${new Date().getTime()}`],
    ['git', 'add', ...filesToAdd],
    [
      'git',
      'commit',
      '-m',
      `[monorail-sync] Automatic file sync commit from ${basename(resolve('.'))}`,
    ],
    ['gh', 'pr', 'create', '--fill'],
  ];
  console.group(`[✓] Making a pull request for synchronized files in \`${repositoryName}\`.`);
  if (process.env.DRY_RUN) {
    commands.forEach((command) => console.log(`> ${normalizedCommandForPrint(command)}`));
    console.groupEnd();
    console.log(`[✓] DRY_RUN for making PR for \`${repositoryName}\` completed.`);
  } else {
    commands.forEach((command) => {
      const normalizedCommandString = normalizedCommandForPrint(command);
      console.group(`> ${normalizedCommandString}`);
      const childProcess = spawnSync(command[0], command.slice(1), { cwd: repositoryPath });

      console.group();
      const pipeOutput = (buffer: Buffer, isError: boolean) => {
        const string = buffer.toString().trim();
        if (!string) return;
        string
          .split('\n')
          .filter(Boolean)
          .forEach((output) => (isError ? console.error(output) : console.log(output)));
      };
      if (childProcess.status !== 0 || process.env.INCLUDE_ERROR) {
        pipeOutput(childProcess.stderr, true);
      }
      pipeOutput(childProcess.stdout, false);
      console.groupEnd();

      console.groupEnd();

      if (childProcess.status !== 0) {
        throw new Error(`Failed to run: \`${command}\``);
      }
    });

    console.groupEnd();
    console.log(`\n[✓] Made a pull request for synchronized files in \`${repositoryName}\`.`);
  }
};

const synchronize = (): void => {
  const synchronizeConfigurationPath = join('configuration', 'sync-configuration.json');
  if (!existsSync(synchronizeConfigurationPath)) {
    return;
  }

  console.group(chalk.blue('--- Monorail Cross-repository Sync Service ---'));
  const synchronizeConfiguration: SynchronizeConfiguration = JSON.parse(
    readFileSync(synchronizeConfigurationPath).toString()
  );

  Object.entries(synchronizeConfiguration).forEach(([repositoryName, synchronizeFileMappings]) => {
    console.group(`\nSynchronizing for \`${repositoryName}\`...`);
    synchronizeToRepository(repositoryName, synchronizeFileMappings);
    console.groupEnd();
  });
  console.groupEnd();

  console.log(`\n${chalk.green('[✓] Synchronized all files.')}`);
};

export default synchronize;
