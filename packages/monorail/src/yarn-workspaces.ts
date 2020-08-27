import { spawnSync } from 'child_process';

type SingleWorkspaceInformationFromYarn = {
  readonly workspaceLocation: string;
  readonly dependencies: readonly string[];
};

export const workspaceInformation = ((): ReadonlyMap<
  string,
  SingleWorkspaceInformationFromYarn
> => {
  const map = new Map<string, SingleWorkspaceInformationFromYarn>();

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

      map.set(name, {
        workspaceLocation: location,
        dependencies: workspaceDependencies.map((dependencyString) => {
          if (!dependencyString.startsWith('packages/')) {
            throw new Error(`Bad dependency of ${name}: ${dependencyString}`);
          }
          return dependencyString.substring('packages/'.length);
        }),
      });
    }
  );
  return map;
})();

const getYarnWorkspaceInRepoDependencyChain = (workspace: string): readonly string[] => {
  const dependencyChain: string[] = [];
  const parentChain: string[] = [];
  const parentSet = new Set<string>();
  const allVisited = new Set<string>();

  const visit = (node: string): void => {
    // Check cyclic dependencies.
    if (allVisited.has(node)) {
      if (!parentSet.has(node)) {
        // We reach the end of the chain because we have visited it before.
        return;
      }
      parentChain.push(node);
      const firstIndex = parentChain.indexOf(node);
      const cyclicDependencyChain = parentChain.slice(firstIndex, parentChain.length).join(' -> ');
      throw new Error(`Cyclic dependency detected: ${cyclicDependencyChain}`);
    }

    // Check dependencies.
    const workspaceDependencies = workspaceInformation.get(node)?.dependencies;
    if (workspaceDependencies == null) {
      throw new Error(`Workspace ${workspace} is not found!`);
    }

    // Visit dependencies
    allVisited.add(node);
    parentChain.push(node);
    parentSet.add(node);
    workspaceDependencies.forEach(visit);
    parentSet.delete(node);
    parentChain.pop();
    dependencyChain.push(node);
  };

  visit(workspace);
  return dependencyChain;
};

export type YarnInvididualWorkspaceInformation = {
  readonly workspaceLocation: string;
  readonly dependencyChain: readonly string[];
};
export type YarnWorkspacesJson = {
  readonly __type__: unknown;
  readonly information: Readonly<Record<string, YarnInvididualWorkspaceInformation>>;
  readonly topologicallyOrdered: readonly string[];
};

export const YARN_WORKSPACES_JSON: YarnWorkspacesJson = {
  __type__: '@' + 'generated',
  information: Object.fromEntries(
    Array.from(workspaceInformation.entries())
      .map(
        ([workspace, { dependencies, ...information }]) =>
          [
            workspace,
            {
              ...information,
              dependencyChain: getYarnWorkspaceInRepoDependencyChain(workspace),
            },
          ] as const
      )
      .sort(([a], [b]) => a.localeCompare(b))
  ),
  topologicallyOrdered: (() => {
    const sorted: string[] = [];
    const set = new Set<string>();

    Array.from(workspaceInformation.keys()).forEach((workspace) => {
      const oneWorkspaceChainSorted = getYarnWorkspaceInRepoDependencyChain(workspace);
      oneWorkspaceChainSorted.forEach((workspaceName) => {
        if (!set.has(workspaceName)) {
          sorted.push(workspaceName);
          set.add(workspaceName);
        }
      });
    });

    return sorted;
  })(),
};
