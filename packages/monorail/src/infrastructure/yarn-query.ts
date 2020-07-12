import { spawnSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

import { assertIsString, assertIsStringArray, assertHasFields } from '../validator';

export type CodegenConfiguration = {
  /** Source directory or single source file. */
  readonly sources: readonly string[];
  /** Output file. */
  readonly output: string;
};

const validateCodegenConfiguration = (json?: unknown): CodegenConfiguration | undefined => {
  const { sources, output } = assertHasFields('codegenConfiguration', ['sources', 'output'], json);
  return {
    sources: assertIsStringArray('sources', sources),
    output: assertIsString('output', output),
  };
};

export type WorkspaceInformation = {
  readonly workspaceLocation: string;
  readonly inRepoWorkspaceDependencies: readonly string[];
  readonly githubRepositoryDependencies: readonly string[];
  readonly deploymentDependencies: readonly string[];
  readonly codegenConfiguration?: CodegenConfiguration;
};

const queryYarnForWorkspaceInformation = (): ReadonlyMap<string, WorkspaceInformation> => {
  const map = new Map<string, WorkspaceInformation>();

  const process = spawnSync('yarn', ['workspaces', 'list', '-v', '--json'], { shell: true });
  const output = process.stdout.toString().trim();
  const parsableJsonString = `[${output.split('\n').join(',')}]`;
  const workspacesJson = JSON.parse(parsableJsonString);

  type WorkspaceInformationFromYarn = {
    readonly name: string | null;
    readonly location: string;
    readonly workspaceDependencies: readonly string[];
  };

  workspacesJson.forEach(
    ({ name, location, workspaceDependencies }: WorkspaceInformationFromYarn) => {
      if (name == null) {
        return;
      }
      const inRepoWorkspaceDependencies = workspaceDependencies.map((dependencyString) => {
        if (!dependencyString.startsWith('packages/')) {
          throw new Error(`Bad dependency of ${name}: ${dependencyString}`);
        }
        return dependencyString.substring('packages/'.length);
      });

      const packageJson = JSON.parse(readFileSync(join(location, 'package.json')).toString());

      map.set(name, {
        workspaceLocation: location,
        inRepoWorkspaceDependencies,
        githubRepositoryDependencies: assertIsStringArray(
          'githubRepositoryDependencies',
          packageJson.githubRepositoryDependencies,
          true
        ),
        deploymentDependencies: assertIsStringArray(
          'deploymentDependencies',
          packageJson.deploymentDependencies,
          true
        ),
        codegenConfiguration:
          packageJson.codegenConfiguration == null
            ? undefined
            : validateCodegenConfiguration(packageJson.codegenConfiguration),
      });
    }
  );
  return map;
};

export default queryYarnForWorkspaceInformation;
