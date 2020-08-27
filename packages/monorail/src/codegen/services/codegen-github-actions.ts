import { MONORAIL_BINARY_PATH } from '../../configuration';
import {
  GitHubActionsWorkflow,
  githubActionJobRunStep,
  githubActionWorkflowToString,
  githubActionJobActionStep,
} from '../ast/github-actions';
import {
  GITHUB_ACTIONS_CHECKOUT_STEP,
  GITHUB_ACTIONS_SETUP_NODE_STEP,
  GITHUB_ACTIONS_USE_YARN_CACHE_STEP,
} from '../github-actions/github-actions-primitives';
import {
  yarnWorkspaceBoilterplateSetupSteps,
  getYarnWorkspaceWorkflows,
} from '../github-actions/github-actions-yarn-workspaces';
import { CodegenService } from './codegen-service-types';

const generateTSJSWorkflow = (): readonly [string, GitHubActionsWorkflow] => [
  'general',
  {
    workflowName: 'General',
    workflowtrigger: {
      triggerPaths: ['**'],
      masterBranchOnly: false,
    },
    workflowJobs: [
      {
        jobName: 'lint',
        jobSteps: [
          ...yarnWorkspaceBoilterplateSetupSteps,
          githubActionJobRunStep('Format Check', 'yarn format:check'),
          githubActionJobRunStep('Lint', 'yarn lint'),
        ],
      },
      {
        jobName: 'build',
        jobSteps: [
          githubActionJobActionStep('actions/checkout@v2', { 'fetch-depth': '2' }),
          GITHUB_ACTIONS_SETUP_NODE_STEP,
          GITHUB_ACTIONS_USE_YARN_CACHE_STEP,
          githubActionJobRunStep('Yarn Install', 'yarn install --immutable'),
          githubActionJobRunStep('Build', 'yarn compile'),
        ],
      },
      {
        jobName: 'test',
        jobSteps: [
          ...yarnWorkspaceBoilterplateSetupSteps,
          githubActionJobRunStep('Test', 'yarn test'),
        ],
      },
    ],
  },
];

const generateCodegenPorcelainWorkflow = (): readonly [string, GitHubActionsWorkflow] => [
  'generated-in-sync',
  {
    workflowName: 'lint-generated',
    workflowtrigger: {
      triggerPaths: ['**'],
      masterBranchOnly: false,
    },
    workflowJobs: [
      {
        jobName: 'lint',
        jobSteps: [
          GITHUB_ACTIONS_CHECKOUT_STEP,
          GITHUB_ACTIONS_SETUP_NODE_STEP,
          githubActionJobRunStep('Codegen', `${MONORAIL_BINARY_PATH} codegen`),
          githubActionJobRunStep(
            'Check changed',
            'if [[ `git status --porcelain` ]]; then exit 1; fi'
          ),
        ],
      },
    ],
  },
];

const githubActionsCodegenService: CodegenService = {
  serviceName: 'Generate GitHub Actions Workflow',
  generatedFilenamePattern: '.github/workflows/generated-*',
  generatedCodeContentList: [
    generateTSJSWorkflow(),
    generateCodegenPorcelainWorkflow(),
    ...Object.entries(getYarnWorkspaceWorkflows()),
  ].map(([name, workflow]) => ({
    pathForGeneratedCode: `.github/workflows/generated-${name}.yml`,
    generatedCode: githubActionWorkflowToString(workflow),
  })),
};

export default githubActionsCodegenService;
