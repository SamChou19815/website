#!/usr/bin/env node

import incrementalCompile from './workspace-incremental';

import { switchToMonorepoRoot } from 'lib-find-monorepo-root';

const main = async (): Promise<void> => {
  try {
    switchToMonorepoRoot();
    await incrementalCompile();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  }
};

main();
