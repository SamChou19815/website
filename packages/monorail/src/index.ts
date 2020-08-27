#!/usr/bin/env node

import incrementalCompile from './incremental-compile';

import { switchToMonorepoRoot } from 'lib-find-monorepo-root';

const main = async (): Promise<void> => {
  try {
    switchToMonorepoRoot();
    switch (process.argv[2].toLowerCase()) {
      case 'compile':
      case 'c':
        await incrementalCompile();
        return;
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
