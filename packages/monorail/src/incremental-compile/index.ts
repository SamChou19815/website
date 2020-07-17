/* eslint-disable no-console */

import {
  getIncrementalCompileLastRunTime,
  setIncrementalCompileLastRunTime,
} from './incremental-compile-cache';

const incrementalCompile = (): void => {
  console.log('--- Monorail Incremental Compile Service ---');

  const lastRunTime = getIncrementalCompileLastRunTime();
  console.log(`Last run time: ${new Date(lastRunTime).toString()}`);

  setIncrementalCompileLastRunTime();
};

export default incrementalCompile;
