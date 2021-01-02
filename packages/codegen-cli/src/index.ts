#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';

import codegenServices from 'repo-codegen-services';

const GITHUB_WORKFLOWS_PATH = join('.github', 'workflows');

const main = async (): Promise<void> => {
  try {
    // Step 1: Cleanup potentially old stale files
    if (!existsSync(GITHUB_WORKFLOWS_PATH)) {
      readdirSync(GITHUB_WORKFLOWS_PATH).forEach((it) => {
        if (it.startsWith('generated-')) {
          unlinkSync(join(GITHUB_WORKFLOWS_PATH, it));
        }
      });
    }

    // Step 2: Create directory for generated workflows.
    mkdirSync(GITHUB_WORKFLOWS_PATH, { recursive: true });

    // Step 3: Write generated files.
    codegenServices.forEach(({ run }) => {
      run('workspaces.json', readFileSync('workspaces.json').toString()).forEach(
        ({ outputFilename, outputContent }) => {
          writeFileSync(outputFilename, outputContent);
        }
      );
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  }
};

main();
