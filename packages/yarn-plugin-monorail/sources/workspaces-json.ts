import type { Locator, Project } from '@yarnpkg/core';

type SingleWorkspaceInformationFromYarn = {
  readonly workspaceLocation: string;
  readonly dependencies: readonly string[];
};

function getWorkspaceName(locator: Locator): string {
  if (locator.scope == null) return locator.name;
  return `@${locator.scope}/${locator.name}`;
}

function getWorkspaceInformation(
  project: Project
): ReadonlyMap<string, SingleWorkspaceInformationFromYarn> {
  const map = new Map<string, SingleWorkspaceInformationFromYarn>();

  project.workspaces.forEach((workspace) => {
    const workspaceLocation = workspace.relativeCwd;
    if (workspaceLocation === '.') return;
    const name = getWorkspaceName(workspace.locator);
    const dependencies = Array.from(workspace.getRecursiveWorkspaceDependencies()).map(
      (dependency) => getWorkspaceName(dependency.locator)
    );
    map.set(name, { workspaceLocation, dependencies });
  });

  return map;
}

function getYarnWorkspaceInRepoDependencyChain(
  workspaceInformation: ReadonlyMap<string, SingleWorkspaceInformationFromYarn>,
  workspace: string
): readonly string[] {
  const dependencyChain: string[] = [];
  const parentChain: string[] = [];
  const parentSet = new Set<string>();
  const allVisited = new Set<string>();

  function visit(node: string): void {
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
  }

  visit(workspace);
  return dependencyChain;
}

export default function generateYarnWorkspacesJson(project: Project): YarnWorkspacesJson {
  const workspaceInformation = getWorkspaceInformation(project);
  return {
    __type__: '@' + 'generated',
    information: Object.fromEntries(
      Array.from(workspaceInformation.entries())
        .map(
          ([workspace, { dependencies, ...information }]) =>
            [
              workspace,
              {
                ...information,
                dependencyChain: getYarnWorkspaceInRepoDependencyChain(
                  workspaceInformation,
                  workspace
                ),
              },
            ] as const
        )
        .sort(([a], [b]) => a.localeCompare(b))
    ),
    topologicallyOrdered: (() => {
      const sorted: string[] = [];
      const set = new Set<string>();

      Array.from(workspaceInformation.keys()).forEach((workspace) => {
        const oneWorkspaceChainSorted = getYarnWorkspaceInRepoDependencyChain(
          workspaceInformation,
          workspace
        );
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
}
