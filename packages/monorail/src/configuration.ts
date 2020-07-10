import { existsSync, readFileSync, lstatSync } from 'fs';
import { join, dirname } from 'path';

type RepoToolsConfiguration = {
  readonly binary: string;
  readonly organizationName: string;
  readonly toolingNamespace: string;
};

const parseRepoToolsConfiguration = (json: unknown): RepoToolsConfiguration => {
  if (typeof json !== 'object' || json == null) {
    throw new Error(`Unexpected configuration format. Bad object: ${JSON.stringify(json)}`);
  }
  const { binary, organizationName, toolingNamespace } = json as Record<string, unknown>;
  if (typeof binary !== 'string') {
    throw new Error('`binary` must be string!');
  }
  if (typeof organizationName !== 'string') {
    throw new Error('`organizationName` must be string!');
  }
  if (typeof toolingNamespace !== 'string') {
    throw new Error('`toolingNamespace` must be string!');
  }
  return { binary, organizationName, toolingNamespace };
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
