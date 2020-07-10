#!/usr/bin/env node

/* eslint-disable import/first */

// Ensuring all subsequent command is run from project root, so this must be the first statement.
// eslint-disable-next-line @typescript-eslint/no-require-imports,  @typescript-eslint/no-var-requires
process.chdir(require('./configuration').PROJECT_ROOT_DIRECTORY);

import parseCommandLineArgumentsIntoCommand from './cli-parser';
import executeCodegenServices from './codegen/services';

const main = (): void => {
  const command = parseCommandLineArgumentsIntoCommand();

  switch (command.type) {
    case 'CODEGEN':
      executeCodegenServices();
      return;
    case 'SYNC':
      return;
    default:
      throw new Error();
  }
};

main();
