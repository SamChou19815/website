#!/usr/bin/env node

/* eslint-disable import/first */

// Ensuring all subsequent command is run from project root, so this must be the first statement.
// eslint-disable-next-line import/order
import { switchToMonorepoRoot } from 'lib-find-monorepo-root';

switchToMonorepoRoot();

import { spawnSync } from 'child_process';
import { join } from 'path';

import incrementalCompile from './incremental-compile';

import { runCodegenServicesIncrementally } from 'lib-codegen';
import codegenServices from 'lib-codegen-services';

const parseCommandLineArgumentsIntoCommand = (): 'CODEGEN' | 'COMPILE' | 'NO_CHANGED' => {
  const normalizedArguments: readonly string[] = process.argv.slice(2);

  if (normalizedArguments.length === 0) {
    return 'CODEGEN';
  }

  switch (normalizedArguments[0].toLowerCase()) {
    case 'codegen':
      return 'CODEGEN';
    case 'compile':
    case 'c':
      return 'COMPILE';
    case 'no-changed':
    case 'nc':
      return 'NO_CHANGED';
    default:
      throw new Error(`Unknown command: ${normalizedArguments[0]}`);
  }
};

const main = async (): Promise<void> => {
  try {
    switch (parseCommandLineArgumentsIntoCommand()) {
      case 'CODEGEN': {
        await runCodegenServicesIncrementally(
          join('.monorail', 'codegen-cache.json'),
          codegenServices
        );
        return;
      }
      case 'COMPILE':
        await incrementalCompile();
        return;
      case 'NO_CHANGED': {
        const changedFiles = spawnSync('git', ['status', '--porcelain'], {
          shell: true,
        }).stdout.toString();
        if (changedFiles.length === 0) return;
        throw new Error(
          `There are changed files! Generated files might be out-of-sync!\n${changedFiles.trimEnd()}`
        );
      }
      default:
        throw new Error();
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  }
};
main();
