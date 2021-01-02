#!/usr/bin/env node

import incrementalCompile from './workspace-incremental';

const main = async (): Promise<void> => {
  try {
    await incrementalCompile();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  }
};

main();
