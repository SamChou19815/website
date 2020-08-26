import { existsSync, readFileSync, lstatSync } from 'fs';
import { join, dirname } from 'path';

import { assertIsString, assertIsStringArray, assertHasFields } from './validator';

type RepoToolsConfiguration = {
  readonly binary: string;
  readonly deploymentSecrets: readonly string[];
};

const parseRepoToolsConfiguration = (json: unknown): RepoToolsConfiguration => {
  const { binary, deploymentSecrets } = assertHasFields(
    'repoToolsConfiguration',
    ['binary', 'deploymentSecrets'],
    json
  );
  return {
    binary: assertIsString('binary', binary),
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
