#!/usr/bin/env node

import Module from 'module';
import { join } from 'path';

import { CodegenService, runCodegenServicesIncrementally } from './library';

import { findMonorepoRoot, switchToMonorepoRoot } from 'lib-find-monorepo-root';

const run = async (): Promise<void> => {
  const servicesModule = process.argv[2];
  if (servicesModule == null) throw new Error('No codegen service module path provided!');

  switchToMonorepoRoot();

  const importer = Module.createRequire(join(findMonorepoRoot(), 'package.json'));
  const services: readonly CodegenService[] = importer(servicesModule);
  await runCodegenServicesIncrementally(services, /* shouldLog */ true);
};

const main = async (): Promise<void> => {
  try {
    await run();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  }
};

main();
