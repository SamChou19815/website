import { execSync } from 'child_process';

const workspaceInformation: ReadonlyMap<string, readonly string[]> = (() => {
  const map = new Map<string, readonly string[]>();
  let output = execSync('yarn workspaces info --silent').toString().trim();
  if (output.startsWith('yarn workspaces')) {
    const lines = output.split('\n');
    output = lines.slice(1, lines.length - 1).join('\n');
  }
  const workspacesJson = JSON.parse(output);
  Object.entries(workspacesJson).forEach(([workspaceName, object]) => {
    map.set(workspaceName, (object as { workspaceDependencies: string[] }).workspaceDependencies);
  });
  return map;
})();

const allPrivateWorkspaces: readonly string[] = Array.from(workspaceInformation.keys()).filter(
  (workspace) => !workspace.startsWith('@dev-sam')
);
const projectWorkspaces: readonly string[] = allPrivateWorkspaces.filter(
  (workspace) => !workspace.startsWith('lib-')
);

const getWorkspaceDependencies = (workspace: string): readonly string[] => {
  const information = workspaceInformation.get(workspace);
  if (information == null) {
    throw new Error(`Workspace ${workspace} is not found!`);
  }
  return information;
};

const getDependencyChain = (workspace: string): readonly string[] => {
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
    const workspaceDependencies = getWorkspaceDependencies(node);

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

/** @throws if there is a cyclic dependency chain. */
const validateDependencyChain = (): void =>
  Array.from(workspaceInformation.keys()).forEach((workspace) => {
    getDependencyChain(workspace);
    // eslint-disable-next-line no-console
    console.log(`No cyclic dependency detected with ${workspace} as root.`);
  });

export { allPrivateWorkspaces, projectWorkspaces, getDependencyChain, validateDependencyChain };
