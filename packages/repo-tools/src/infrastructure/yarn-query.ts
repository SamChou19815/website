import { spawnSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

export type WorkspaceInformation = {
  readonly inRepoWorkspaceDependencies: readonly string[];
  readonly devSamRepositoryDependencies: readonly string[];
  readonly deploymentDependencies: readonly string[];
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
        inRepoWorkspaceDependencies,
        devSamRepositoryDependencies: packageJson.devSamRepositoryDependencies ?? [],
        deploymentDependencies: packageJson.deploymentDependencies ?? [],
      });
    }
  );
  return map;
};

export default queryYarnForWorkspaceInformation;
