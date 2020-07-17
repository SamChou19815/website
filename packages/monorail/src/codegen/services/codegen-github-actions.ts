import { PROJECT_CONFIGURATION } from '../../configuration';
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
import workspaceSpecificOverrides from '../github-actions/github-actions-yarn-workspace-overrides';
import {
  yarnWorkspaceBoilterplateSetupSteps,
  getYarnWorkspaceWorkflows,
} from '../github-actions/github-actions-yarn-workspaces';
import { CodegenService } from './codegen-service-types';

const generateTSJSWorkflow = (): readonly [string, GitHubActionsWorkflow] => [
  'ts-js',
  {
    workflowName: 'TS and JS',
    workflowtrigger: {
      triggerPaths: [
        '.github/workflows/generated-ts-js.yml',
        'package.json',
        '**/package.json',
        '**.js',
        '**.ts',
        '**.jsx',
        '**.tsx',
      ],
      masterBranchOnly: false,
    },
    workflowJobs: [
      {
        jobName: 'lint',
        jobSteps: [
          ...yarnWorkspaceBoilterplateSetupSteps,
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
          githubActionJobRunStep('Codegen', `${PROJECT_CONFIGURATION.binary} codegen`),
          githubActionJobRunStep('Check changed', 'git diff --quiet --exit-code'),
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
    ...Object.entries(getYarnWorkspaceWorkflows(workspaceSpecificOverrides)),
  ].map(([name, workflow]) => ({
    pathForGeneratedCode: `.github/workflows/generated-${name}.yml`,
    generatedCode: githubActionWorkflowToString(workflow),
  })),
};

export default githubActionsCodegenService;
