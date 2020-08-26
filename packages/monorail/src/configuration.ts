import { existsSync, readFileSync, lstatSync } from 'fs';
import { join, dirname, relative } from 'path';

const findMonorepoRoot = (): string => {
  let configurationDirectory = process.cwd();
  while (configurationDirectory !== '/') {
    const configurationPath = join(configurationDirectory, 'package.json');
    if (existsSync(configurationPath) && lstatSync(configurationPath).isFile()) {
      const packageJson = JSON.parse(readFileSync(configurationPath).toString());
      // Detect root Yarn workspace
      if (Array.isArray(packageJson.workspaces)) {
        return configurationDirectory;
      }
    }
    configurationDirectory = dirname(configurationDirectory);
  }
  throw new Error('No root package.json found. Abort!');
};

export const PROJECT_ROOT_DIRECTORY = findMonorepoRoot();

export const MONORAIL_BINARY_PATH = relative(PROJECT_ROOT_DIRECTORY, process.argv[1]);
