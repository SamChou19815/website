#!/usr/bin/env node

import { runCodegenServicesIncrementally } from './library';

import services from 'repo-codegen-services';

const main = async (): Promise<void> => {
  try {
    await runCodegenServicesIncrementally(services, /* shouldLog */ true);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  }
};

main();
