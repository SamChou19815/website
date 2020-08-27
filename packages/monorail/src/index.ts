#!/usr/bin/env node

// Ensuring all subsequent command is run from project root, so this must be the first statement.
// eslint-disable-next-line import/order
import { switchToMonorepoRoot } from 'lib-find-monorepo-root';

switchToMonorepoRoot();

// eslint-disable-next-line import/first, import/order
import incrementalCompile from './incremental-compile';

const main = async (): Promise<void> => {
  try {
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
