import { existsSync, readFileSync, lstatSync } from 'fs';
import { join, dirname } from 'path';

import { assertIsString, assertIsStringArray, assertHasFields } from './validator';

type RepoToolsConfiguration = {
  readonly binary: string;
  readonly organizationName: string;
  readonly toolingPrefixes: readonly string[];
};

const parseRepoToolsConfiguration = (json: unknown): RepoToolsConfiguration => {
  const { binary, organizationName, toolingPrefixes } = assertHasFields(
    'repoToolsConfiguration',
    ['binary', 'organizationName', 'toolingPrefixes'],
    json
  );
  return {
    binary: assertIsString('binary', binary),
    organizationName: assertIsString('organizationName', organizationName),
    toolingPrefixes: assertIsStringArray('toolingPrefixes', toolingPrefixes),
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
