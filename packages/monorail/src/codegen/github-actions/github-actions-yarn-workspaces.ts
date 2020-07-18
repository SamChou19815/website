import { PROJECT_CONFIGURATION } from '../../configuration';
import {
  projectWorkspaces,
  getYarnWorkspaceLocation,
  getYarnWorkspaceInRepoDependencyChain,
  getYarnWorkspaceGitHubRepositoryDependencies,
  getYarnWorkspaceDeploymentDependencies,
} from '../../infrastructure/yarn-workspace-dependency-analysis';
import {
  GitHubActionsWorkflow,
  githubActionJobRunStep,
  GitHubActionJobStep,
} from '../ast/github-actions';
import {
  GITHUB_ACTIONS_CHECKOUT_STEP,
  GITHUB_ACTIONS_SETUP_NODE_STEP,
  GITHUB_ACTIONS_USE_YARN_CACHE_STEP,
  getGitHubRepositoryDependencySetupSteps,
  getDeploymentDependencySetupStep,
} from './github-actions-primitives';

export const yarnWorkspaceBoilterplateSetupSteps = [
  GITHUB_ACTIONS_CHECKOUT_STEP,
  GITHUB_ACTIONS_SETUP_NODE_STEP,
  GITHUB_ACTIONS_USE_YARN_CACHE_STEP,
  githubActionJobRunStep('Yarn Install', 'yarn install --immutable'),
];

const yarnWorkspaceGetDependencyPaths = (workspace: string): readonly string[] => [
  ...getYarnWorkspaceInRepoDependencyChain(workspace).map(
    (name) => `${getYarnWorkspaceLocation(name)}/**`
  ),
  'configuration/**',
  `.github/workflows/generated-*-${workspace}.yml`,
];

const generateYarnWorkspaceProjectCDWorkflow = (
  workspace: string,
  prepareSteps: readonly GitHubActionJobStep[]
): GitHubActionsWorkflow => ({
  workflowName: `CD ${workspace}`,
  workflowtrigger: {
    triggerPaths: yarnWorkspaceGetDependencyPaths(workspace),
    masterBranchOnly: true,
  },
  workflowSecrets: PROJECT_CONFIGURATION.deploymentSecrets,
  workflowJobs: [
    {
      jobName: 'deploy',
      jobSteps: [
        ...getYarnWorkspaceGitHubRepositoryDependencies(workspace)
          .map(getGitHubRepositoryDependencySetupSteps)
          .flat(),
        ...getYarnWorkspaceDeploymentDependencies(workspace).map(getDeploymentDependencySetupStep),
        ...yarnWorkspaceBoilterplateSetupSteps,
        ...prepareSteps,
        githubActionJobRunStep('Build', `yarn workspace ${workspace} build`),
        githubActionJobRunStep('Deploy', `yarn workspace ${workspace} deploy`),
      ],
    },
  ],
});

export type YarnWorkspaceWorkflowsOverrides = Record<
  string,
  readonly GitHubActionJobStep[] | undefined
>;

export const getYarnWorkspaceWorkflows = (
  overridePrepares: YarnWorkspaceWorkflowsOverrides = {}
): Record<string, GitHubActionsWorkflow> =>
  Object.fromEntries([
    ...projectWorkspaces.map((workspace) => {
      const name = `cd-${workspace}`;
      return [
        name,
        generateYarnWorkspaceProjectCDWorkflow(workspace, overridePrepares[name] ?? []),
      ];
    }),
  ]);
