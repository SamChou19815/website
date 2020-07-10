/* eslint-disable import/first */

// Ensuring all subsequent command is run from project root, so this must be the first statement.
// eslint-disable-next-line @typescript-eslint/no-require-imports,  @typescript-eslint/no-var-requires
process.chdir(require('./configuration').PROJECT_ROOT_DIRECTORY);

import executeCodegenServices from './codegen/services';

executeCodegenServices();
