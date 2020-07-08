import { spawnSync } from 'child_process';

const queryYarnForWorkspaceInformation = (): ReadonlyMap<string, readonly string[]> => {
  const map = new Map<string, readonly string[]>();

  const process = spawnSync('yarn', ['workspaces', 'list', '-v', '--json'], { shell: true });
  const output = process.stdout.toString().trim();
  const parsableJsonString = `[${output.split('\n').join(',')}]`;
  const workspacesJson = JSON.parse(parsableJsonString);

  type WorkspaceInformationFromYarn = {
    readonly name: string | null;
    readonly workspaceDependencies: readonly string[];
  };

  workspacesJson.forEach(({ name, workspaceDependencies }: WorkspaceInformationFromYarn) => {
    if (name == null) {
      return;
    }
    map.set(
      name,
      workspaceDependencies.map((dependencyString) => {
        if (!dependencyString.startsWith('packages/')) {
          throw new Error(`Bad dependency of ${name}: ${dependencyString}`);
        }
        return dependencyString.substring('packages/'.length);
      })
    );
  });
  return map;
};

export default queryYarnForWorkspaceInformation;
