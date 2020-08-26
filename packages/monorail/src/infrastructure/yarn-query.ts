import { spawnSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

const assertIsLibraryType = (value?: unknown): 'library' | 'tool' | 'app' => {
  if (value == null) return 'library';
  if (typeof value !== 'string') {
    throw new Error(`Expect 'packageType' to be a string!`);
  }
  if (value !== 'tool' && value !== 'app') throw new Error('');
  return value;
};

export type WorkspaceInformation = {
  readonly workspaceLocation: string;
  readonly packageType: 'library' | 'tool' | 'app';
  readonly dependencies: readonly string[];
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
      const dependencies = workspaceDependencies.map((dependencyString) => {
        if (!dependencyString.startsWith('packages/')) {
          throw new Error(`Bad dependency of ${name}: ${dependencyString}`);
        }
        return dependencyString.substring('packages/'.length);
      });

      const packageJson = JSON.parse(readFileSync(join(location, 'package.json')).toString());

      map.set(name, {
        workspaceLocation: location,
        dependencies,
        packageType: assertIsLibraryType(packageJson.packageType),
      });
    }
  );
  return map;
};

export default queryYarnForWorkspaceInformation;
