import { spawnSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

import { assertIsString, assertIsStringArray, assertHasFields } from '../validator';

export type CodegenConfiguration = {
  /** Output file. */
  readonly output: string;
};

const assertIsLibraryType = (value?: unknown): 'library' | 'tool' | 'app' => {
  if (value == null) return 'library';
  const type = assertIsString('packageType', value);
  if (type !== 'tool' && type !== 'app') throw new Error('');
  return type;
};

const validateCodegenConfiguration = (json?: unknown): CodegenConfiguration | undefined => {
  return {
    output: assertIsString(
      'output',
      assertHasFields('codegenConfiguration', ['output'], json).output
    ),
  };
};

export type WorkspaceInformation = {
  readonly workspaceLocation: string;
  readonly hasCompileScript: boolean;
  readonly packageType: 'library' | 'tool' | 'app';
  readonly inRepoWorkspaceDependencies: readonly string[];
  readonly deploymentDependencies: readonly string[];
  readonly codegenConfiguration?: CodegenConfiguration;
};

const queryYarnForWorkspaceInformation = (): ReadonlyMap<string, WorkspaceInformation> => {
  const map = new Map<string, WorkspaceInformation>();

  const process = spawnSync('yarn', ['workspaces', 'list', '-v', '--json']);
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
        hasCompileScript: packageJson.scripts?.compile != null,
        inRepoWorkspaceDependencies,
        packageType: assertIsLibraryType(packageJson.packageType),
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
