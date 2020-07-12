#!/usr/bin/env node

/* eslint-disable import/first */

// Ensuring all subsequent command is run from project root, so this must be the first statement.
// eslint-disable-next-line @typescript-eslint/no-require-imports,  @typescript-eslint/no-var-requires
process.chdir(require('./configuration').PROJECT_ROOT_DIRECTORY);

import cachedBuild from './cached-build';
import parseCommandLineArgumentsIntoCommand from './cli-parser';
import executeCodegenServices from './codegen/services';
import synchronize from './sync';

/**
 * Supported commands:
 *
 * - codegen: Generate code according to repository configuration and Yarn workspace setup.
 * - sync: Push changes in other known repositories if git status is not clean.
 */
const main = async (): Promise<void> => {
  try {
    switch (parseCommandLineArgumentsIntoCommand()) {
      case 'CODEGEN':
        executeCodegenServices();
        return;
      case 'REBUILD':
        await cachedBuild();
        return;
      case 'SYNC':
        synchronize();
        return;
      default:
        throw new Error();
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error.message);
    process.exit(1);
  }
};

main();
