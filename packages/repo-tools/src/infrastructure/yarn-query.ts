import { spawnSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

export type WorkspaceInformation = {
  readonly inRepoWorkspaceDependencies: readonly string[];
  readonly devSamRepositoryDependencies: readonly string[];
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
      const devSamRepositoryDependencies: readonly string[] =
        JSON.parse(readFileSync(join(location, 'package.json')).toString())
          .devSamRepositoryDependencies ?? [];
      map.set(name, { inRepoWorkspaceDependencies, devSamRepositoryDependencies });
    }
  );
  return map;
};

export default queryYarnForWorkspaceInformation;
