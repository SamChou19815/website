/* eslint-disable no-console */
import { spawnSync } from 'child_process';

type WorkspaceInformation = {
  readonly location: string;
  readonly workspaceDependencies: readonly string[];
  readonly mismatchedWorkspaceDependencies: readonly string[];
};

type WorkspacesInformation = { readonly [workspace: string]: WorkspaceInformation };

let memoizedWorkspacesInformation: WorkspacesInformation | null = null;

const getWorkspacesInformation = (): WorkspacesInformation => {
  const information = memoizedWorkspacesInformation;
  if (information !== null) {
    return information;
  }
  const informationFromYarn = JSON.parse(spawnSync('yarn', ['workspaces', 'info']).stdout);
  memoizedWorkspacesInformation = informationFromYarn;
  return informationFromYarn;
};

const getWorkspaceInformation = (
  workspaces: WorkspacesInformation,
  workspace: string,
): WorkspaceInformation => {
  const information = workspaces[workspace];
  if (information == null) {
    throw new Error(`Workspace ${workspace} is not found!`);
  }
  return information;
};

/**
 * Visible for testing.
 */
export const _constructDependencyChain = (
  workspaces: WorkspacesInformation,
  workspace: string,
  dependencyChain: string[] = [],
  parentChain: string[] = [],
  parentSet: Set<string> = new Set(),
  allVisited: Set<string> = new Set(),
): void => {
  // Check cyclic dependencies.
  if (allVisited.has(workspace)) {
    if (!parentSet.has(workspace)) {
      // We reach the end of the chain because we have visited it before.
      return;
    }
    parentChain.push(workspace);
    const firstIndex = parentChain.indexOf(workspace);
    throw new Error(`Cyclic dependency detected: ${parentChain.slice(firstIndex).join(' -> ')}.`);
  }

  // Check dependencies.
  const {
    workspaceDependencies, mismatchedWorkspaceDependencies,
  } = getWorkspaceInformation(workspaces, workspace);
  if (mismatchedWorkspaceDependencies.length > 0) {
    throw new Error(`Mismatched dependencies: ${mismatchedWorkspaceDependencies.join(', ')}.`);
  }

  // Visit dependencies.
  allVisited.add(workspace);
  parentChain.push(workspace);
  parentSet.add(workspace);
  workspaceDependencies.forEach((dependency) => {
    _constructDependencyChain(
      workspaces,
      dependency,
      dependencyChain,
      parentChain,
      parentSet,
      allVisited,
    );
  });
  parentSet.delete(workspace);
  parentChain.pop();
  dependencyChain.push(workspace);
};

/**
 * @returns whether the dependency chain is valid.
 * i.e. No cyclic dependencies and mismatched dependencies.
 */
export const validateDependencyChain = (): boolean => {
  const workspaces = getWorkspacesInformation();
  return Object.keys(workspaces).every((workspace) => {
    try {
      _constructDependencyChain(workspaces, workspace);
      return true;
    } catch (e) {
      console.log(e.message);
      return false;
    }
  });
};

/**
 * @param workspace the workspace to query the dependency chain.
 * @returns an ordered sequence of workspace names that represents a valid order to build the
 * packages that respects the dependency declaration.
 */
export const getDependencyChain = (workspace: string): readonly string[] => {
  const dependencyChain: string[] = [];
  _constructDependencyChain(getWorkspacesInformation(), workspace, dependencyChain);
  return dependencyChain;
};
