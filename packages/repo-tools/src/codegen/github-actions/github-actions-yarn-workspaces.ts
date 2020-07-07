import {
  toolingWorkspaces,
  nonToolingWorkspaces,
  projectWorkspaces,
  getDependencyChain,
} from '../../infrastructure/workspace';
import { GitHubActionsWorkflow, githubActionJobRunStep } from '../ast/github-actions';
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

const generateYarnWorkspaceProjectCIWorkflow = (workspaceName: string): GitHubActionsWorkflow => ({
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
        githubActionJobRunStep('Compile', `yarn workspace ${workspaceName} compile`),
      ],
    },
  ],
});

const generateYarnWorkspaceProjectCDWorkflow = (workspace: string): GitHubActionsWorkflow => ({
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
        githubActionJobRunStep('Build', `yarn workspace ${workspace} build`),
        githubActionJobRunStep('Deploy', `yarn workspace ${workspace} deploy`),
      ],
    },
  ],
});

type GitHubActionsWorkflowCollection = Record<string, GitHubActionsWorkflow>;

export const getYarnWorkspaceWorkflows = (): GitHubActionsWorkflowCollection =>
  Object.fromEntries([
    ...toolingWorkspaces.map((workspace) => [
      `ci-${workspace.substring('@dev-sam/'.length)}`,
      generateYarnWorkspaceProjectCIWorkflow(workspace),
    ]),
    ...nonToolingWorkspaces.map((workspace) => [
      `ci-${workspace}`,
      generateYarnWorkspaceProjectCIWorkflow(workspace),
    ]),
    ...projectWorkspaces.map((workspace) => [
      `cd-${workspace}`,
      generateYarnWorkspaceProjectCDWorkflow(workspace),
    ]),
  ]);
