import { existsSync, readFileSync, lstatSync } from 'fs';
import { join, dirname, relative } from 'path';

import { assertIsStringArray, assertHasFields } from './validator';

type RepoToolsConfiguration = {
  readonly deploymentSecrets: readonly string[];
};

const parseRepoToolsConfiguration = (json: unknown): RepoToolsConfiguration => {
  const { deploymentSecrets } = assertHasFields(
    'repoToolsConfiguration',
    ['deploymentSecrets'],
    json
  );
  return {
    deploymentSecrets: assertIsStringArray('deploymentSecrets', deploymentSecrets),
  };
};

const loadRepoToolsConfigurationAndFindRoot = (): readonly [string, RepoToolsConfiguration] => {
  let configurationDirectory = process.cwd();
  while (configurationDirectory !== '/') {
    const configurationPath = join(configurationDirectory, 'package.json');
    if (existsSync(configurationPath) && lstatSync(configurationPath).isFile()) {
      const packageJson = JSON.parse(readFileSync(configurationPath).toString());
      // Detect root Yarn workspace
      if (Array.isArray(packageJson.workspaces)) {
        return [
          configurationDirectory,
          parseRepoToolsConfiguration(packageJson.repoToolsConfiguration),
        ];
      }
    }
    configurationDirectory = dirname(configurationDirectory);
  }
  throw new Error('No configuration found. Abort!');
};

export const [
  PROJECT_ROOT_DIRECTORY,
  PROJECT_CONFIGURATION,
] = loadRepoToolsConfigurationAndFindRoot();

export const MONORAIL_BINARY_PATH = relative(PROJECT_ROOT_DIRECTORY, process.argv[1]);
