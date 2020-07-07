import {
  toolingWorkspaces,
  nonToolingWorkspaces,
  projectWorkspaces,
  getDependencyChain,
} from '../../infrastructure/workspace';
import {
  GitHubActionsWorkflow,
  githubActionJobRunStep,
  GitHubActionJobStep,
} from '../ast/github-actions';
import {
  GITHUB_ACTIONS_CHECKOUT_STEP,
  GITHUB_ACTIONS_SETUP_NODE_STEP,
  GITHUB_ACTIONS_USE_YARN_CACHE_STEP,
} from './github-actions-primitives';

export const yarnWorkspaceBoilterplateSetupSteps = [
  GITHUB_ACTIONS_CHECKOUT_STEP,
  GITHUB_ACTIONS_SETUP_NODE_STEP,
  GITHUB_ACTIONS_USE_YARN_CACHE_STEP,
  githubActionJobRunStep('Yarn Install', 'yarn install'),
];

const yarnWorkspaceGetDependencyPaths = (workspace: string): readonly string[] => [
  ...getDependencyChain(workspace).map(
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
        githubActionJobRunStep('Build', `yarn workspace ${workspace} build`),
        githubActionJobRunStep('Deploy', `yarn workspace ${workspace} deploy`),
      ],
    },
  ],
});

export const getYarnWorkspaceWorkflows = (
  overridePrepares: Record<string, readonly GitHubActionJobStep[] | undefined> = {}
): Record<string, GitHubActionsWorkflow> =>
  Object.fromEntries([
    ...toolingWorkspaces.map((workspace) => {
      const name = `ci-${workspace.substring('@dev-sam/'.length)}`;
      return [
        name,
        generateYarnWorkspaceProjectCIWorkflow(workspace, overridePrepares[name] ?? []),
      ];
    }),
    ...nonToolingWorkspaces.map((workspace) => {
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
