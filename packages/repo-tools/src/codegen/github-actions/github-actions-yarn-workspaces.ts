import {
  toolingWorkspaces,
  libraryWorkspaces,
  projectWorkspaces,
  getYarnWorkspaceInRepoDependencyChain,
  getYarnWorkspaceSevSamRepositoryDependencies,
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
  getDevSamRepositoryDependencySetupSteps,
} from './github-actions-primitives';

export const yarnWorkspaceBoilterplateSetupSteps = [
  GITHUB_ACTIONS_CHECKOUT_STEP,
  GITHUB_ACTIONS_SETUP_NODE_STEP,
  GITHUB_ACTIONS_USE_YARN_CACHE_STEP,
  githubActionJobRunStep('Yarn Install', 'yarn install'),
];

const yarnWorkspaceGetDependencyPaths = (workspace: string): readonly string[] => [
  ...getYarnWorkspaceInRepoDependencyChain(workspace).map(
    (dependency) =>
      `packages/${
        dependency.startsWith('@dev-sam/') ? dependency.substring('@dev-sam/'.length) : dependency
      }/**`
  ),
  'package.json',
  'yarn.lock',
  'configuration/**',
  `.github/workflows/generated-*-${workspace}.yml`,
];

const generateYarnWorkspaceProjectCIWorkflow = (
  workspaceName: string,
  prepareSteps: readonly GitHubActionJobStep[]
): GitHubActionsWorkflow => ({
  workflowName: `CI ${workspaceName}`,
  workflowtrigger: {
    triggerPaths: yarnWorkspaceGetDependencyPaths(workspaceName),
    masterBranchOnly: false,
  },
  workflowJobs: [
    {
      jobName: 'build',
      jobSteps: [
        ...yarnWorkspaceBoilterplateSetupSteps,
        ...prepareSteps,
        ...getYarnWorkspaceSevSamRepositoryDependencies(workspaceName)
          .map(getDevSamRepositoryDependencySetupSteps)
          .flat(),
        githubActionJobRunStep('Compile', `yarn workspace ${workspaceName} compile`),
      ],
    },
  ],
});

const generateYarnWorkspaceProjectCDWorkflow = (
  workspace: string,
  prepareSteps: readonly GitHubActionJobStep[]
): GitHubActionsWorkflow => ({
  workflowName: `CD ${workspace}`,
  workflowtrigger: {
    triggerPaths: yarnWorkspaceGetDependencyPaths(workspace),
    masterBranchOnly: true,
  },
  workflowSecrets: ['FIREBASE_TOKEN'],
  workflowJobs: [
    {
      jobName: 'deploy',
      jobSteps: [
        ...yarnWorkspaceBoilterplateSetupSteps,
        ...prepareSteps,
        ...getYarnWorkspaceSevSamRepositoryDependencies(workspace)
          .map(getDevSamRepositoryDependencySetupSteps)
          .flat(),
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
    ...toolingWorkspaces.map((workspace) => {
      const name = `ci-${workspace.substring('@dev-sam/'.length)}`;
      return [
        name,
        generateYarnWorkspaceProjectCIWorkflow(workspace, overridePrepares[name] ?? []),
      ];
    }),
    ...[...libraryWorkspaces, ...projectWorkspaces].map((workspace) => {
      const name = `ci-${workspace}`;
      return [
        name,
        generateYarnWorkspaceProjectCIWorkflow(workspace, overridePrepares[name] ?? []),
      ];
    }),
    ...projectWorkspaces.map((workspace) => {
      const name = `cd-${workspace}`;
      return [
        name,
        generateYarnWorkspaceProjectCDWorkflow(workspace, overridePrepares[name] ?? []),
      ];
    }),
  ]);
