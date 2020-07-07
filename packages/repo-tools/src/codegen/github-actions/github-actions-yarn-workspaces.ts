import {
  toolingWorkspaces,
  nonToolingWorkspaces,
  projectWorkspaces,
  getDependencyChain,
} from '../../infrastructure/workspace';
import {
  GitHubActionsWorkflow,
  githubActionJobActionStep,
  githubActionJobRunStep,
} from '../ast/github-actions';

export const yarnWorkspaceBoilterplateSetupSteps = [
  githubActionJobActionStep('actions/checkout@v2'),
  githubActionJobActionStep('actions/setup-node@v1'),
  githubActionJobActionStep('actions/cache@v2', {
    path: '.yarn/cache\n.pnp.js',
    // eslint-disable-next-line no-template-curly-in-string
    key: "yarn-berry-${{ hashFiles('**/yarn.lock') }}",
    'restore-keys': 'yarn-berry-',
  }),
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

type GitHubActionsWorkflowCollectionGroupsByType = {
  readonly toolingCI: GitHubActionsWorkflowCollection;
  readonly nonToolingCI: GitHubActionsWorkflowCollection;
  readonly projectsCD: GitHubActionsWorkflowCollection;
};

export const getYarnWorkspaceWorkflowsGroupedByType = (): GitHubActionsWorkflowCollectionGroupsByType => ({
  toolingCI: Object.fromEntries(
    toolingWorkspaces.map((workspace) => [
      workspace,
      generateYarnWorkspaceProjectCIWorkflow(workspace),
    ])
  ),
  nonToolingCI: Object.fromEntries(
    nonToolingWorkspaces.map((workspace) => [
      workspace,
      generateYarnWorkspaceProjectCIWorkflow(workspace),
    ])
  ),
  projectsCD: Object.fromEntries(
    projectWorkspaces.map((workspace) => [
      workspace,
      generateYarnWorkspaceProjectCDWorkflow(workspace),
    ])
  ),
});
