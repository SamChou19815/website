import { existsSync, readFileSync, lstatSync } from 'fs';
import { join, dirname } from 'path';

export const findMonorepoRoot = (): string => {
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

export const switchToMonorepoRoot = (): void => {
  try {
    process.chdir(findMonorepoRoot());
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error.message);
    process.exit(1);
  }
};
