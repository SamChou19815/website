import {
  workspaceNames,
  getYarnWorkspacePackageType,
  getYarnWorkspaceLocation,
  getYarnWorkspaceInRepoDependencyChain,
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
        githubActionJobRunStep('Install firebase-tools', 'sudo npm install -g firebase-tools'),
        githubActionJobRunStep('Deploy', `yarn workspace ${workspace} deploy`),
      ],
    },
  ],
});

export type YarnWorkspaceWorkflowsOverrides = Record<
  string,
  readonly GitHubActionJobStep[] | undefined
>;

export const getYarnWorkspaceWorkflows = (): Record<string, GitHubActionsWorkflow> =>
  Object.fromEntries([
    ...workspaceNames
      .filter((name) => getYarnWorkspacePackageType(name) === 'app')
      .map((workspace) => {
        const name = `cd-${workspace}`;
        return [name, generateYarnWorkspaceProjectCDWorkflow(workspace)];
      }),
  ]);
