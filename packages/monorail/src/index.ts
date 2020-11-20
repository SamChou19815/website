#!/usr/bin/env node

import { incrementalCompile, incrementalBundle } from './workspace-incremental';

import { switchToMonorepoRoot } from 'lib-find-monorepo-root';

const main = async (): Promise<void> => {
  try {
    switchToMonorepoRoot();
    switch (process.argv[2]?.toLowerCase()) {
      case 'compile':
      case 'c':
        await incrementalCompile();
        return;
      case 'bundle':
      case 'b':
        await incrementalBundle();
        return;
      default:
        throw new Error('Invalid command.');
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  }
};

main();
