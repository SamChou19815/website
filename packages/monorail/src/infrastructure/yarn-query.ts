import { spawnSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

export type CodegenConfiguration = {
  /** Source directory or single source file. */
  readonly sources: string;
  /** Output file. */
  readonly output: string;
};

const validateCodegenConfiguration = (json?: unknown): CodegenConfiguration | undefined => {
  if (json == null) {
    return undefined;
  }
  if (typeof json !== 'object') {
    throw new Error('Invalid codegen configuration. It should be an object.');
  }
  const { sources, output } = json as Record<string, unknown>;
  if (typeof sources !== 'string' || typeof output !== 'string') {
    throw new Error('Invalid codegen configuration. `sources` should be a string!');
  }
  if (typeof output !== 'string') {
    throw new Error('Invalid codegen configuration. `output` should be a string!');
  }
  return { sources, output };
};

export type WorkspaceInformation = {
  readonly workspaceLocation: string;
  readonly inRepoWorkspaceDependencies: readonly string[];
  readonly devSamRepositoryDependencies: readonly string[];
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
        devSamRepositoryDependencies: packageJson.devSamRepositoryDependencies ?? [],
        deploymentDependencies: packageJson.deploymentDependencies ?? [],
        codegenConfiguration: validateCodegenConfiguration(packageJson.codegenConfiguration),
      });
    }
  );
  return map;
};

export default queryYarnForWorkspaceInformation;
