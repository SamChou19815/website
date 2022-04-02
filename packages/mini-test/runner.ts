import { spawnSync } from 'child_process';
import { resolve } from 'path';
import { __INTERNAL__RUN_ALL_TEST_CASES__, __INTERNAL__SET_CURRENT_TEST_PATH } from '.';

spawnSync('git', ['add', '.']);
spawnSync('git', ['ls-files', '**/*.test.ts'])
  .stdout.toString()
  .trim()
  .split('\n')
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  .map((it) => require(__INTERNAL__SET_CURRENT_TEST_PATH(resolve(it))));

if (!__INTERNAL__RUN_ALL_TEST_CASES__()) {
  process.exit(1);
}
