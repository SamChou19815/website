import { PROJECT_CONFIGURATION } from '../configuration';

/**
 * There are three types of workspaces in this monorepo:
 *
 * 1. Workspaces start with any item in `<PROJECT_CONFIGURATION.toolingPrefixes>`.
 *    They are tooling workspaces. They are designed to be as general as possible, so that they can
 *    potentially be published on npm and used by other developer sam projects.
 *    Note: This particular name prefix is used because `@dev-sam/eslint-config-common` is a published
 *    package which needs to live under `@dev-sam` namespace.
 * 2. Workspaces start with `lib-`
 *    They are library workspaces. They will not be published and only be used for projects inside
 *    this repository.
 * 3. All other workspaces.
 *    They are project workspaces. They will be deployed to various subdomains under developersam.com.
 *    These workspaces will be named after their subdomain.
 *
 * All workspaces will be tested in CI when their code changes. All project workspaces will be
 * automatically deployed to production in every master push. The repo tools will generate GitHub
 * Actions config using dependency information to ensure that only necessary checks/deployments
 * happen.
 */
type YarnWorkspaceClassifierResult = {
  readonly toolingWorkspaces: readonly string[];
  readonly libraryWorkspaces: readonly string[];
  readonly projectWorkspaces: readonly string[];
};

const classifyYarnWorkspaces = (workspaces: readonly string[]): YarnWorkspaceClassifierResult => {
  const toolingWorkspaces: string[] = [];
  const libraryWorkspaces: string[] = [];
  const projectWorkspaces: string[] = [];

  workspaces.forEach((workspace) => {
    if (PROJECT_CONFIGURATION.toolingPrefixes.some((prefix) => workspace.startsWith(prefix))) {
      toolingWorkspaces.push(workspace);
    } else if (workspace.startsWith('lib-')) {
      libraryWorkspaces.push(workspace);
    } else {
      projectWorkspaces.push(workspace);
    }
  });
  return { toolingWorkspaces, libraryWorkspaces, projectWorkspaces };
};

export default classifyYarnWorkspaces;
