#!/usr/bin/env node

import Module from 'module';
import { join } from 'path';

import { runCodegenServicesIncrementally } from './library';

import type { CodegenService } from 'lib-codegen';
import { findMonorepoRoot, switchToMonorepoRoot } from 'lib-find-monorepo-root';

const run = async (): Promise<void> => {
  const servicesModule = process.argv[2];
  if (servicesModule == null) throw new Error('No codegen service module path provided!');

  switchToMonorepoRoot();

  const importer = Module.createRequire(join(findMonorepoRoot(), 'package.json'));
  const services: readonly CodegenService[] = importer(servicesModule);
  await runCodegenServicesIncrementally(services);
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
