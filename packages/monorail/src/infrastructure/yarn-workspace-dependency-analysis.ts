import queryYarnForWorkspaceInformation, { WorkspaceInformation } from './yarn-query';
import classifyYarnWorkspaces from './yarn-workspace-classifier';

export const workspaceInformation = queryYarnForWorkspaceInformation();

export const { toolingWorkspaces, libraryWorkspaces, projectWorkspaces } = classifyYarnWorkspaces(
  Array.from(workspaceInformation.keys())
);

const getWorkspaceInformation = (workspace: string): WorkspaceInformation => {
  const information = workspaceInformation.get(workspace);
  if (information == null) {
    throw new Error(`Workspace ${workspace} is not found!`);
  }
  return information;
};

export const getYarnWorkspaceLocation = (workspace: string): string =>
  getWorkspaceInformation(workspace).workspaceLocation;

export const getYarnWorkspaceInRepoDependencyChain = (workspace: string): readonly string[] => {
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
    const workspaceDependencies = getWorkspaceInformation(node).inRepoWorkspaceDependencies;

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

export const getYarnWorkspaceDevSamRepositoryDependencies = (
  workspace: string
): readonly string[] => getWorkspaceInformation(workspace).devSamRepositoryDependencies;

export const getYarnWorkspaceDeploymentDependencies = (workspace: string): readonly string[] =>
  getWorkspaceInformation(workspace).deploymentDependencies;
